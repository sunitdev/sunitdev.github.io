import { test } from 'node:test';
import assert from 'node:assert/strict';
import { highlightNotebookSources } from './notebook-highlight';
import type { NotebookCell } from './notebook-format';

function highlight(source: NotebookCell['source']) {
  return highlightNotebookSources([{ cell_type: 'code', source }])[0];
}

function withoutSpans(html: string) {
  return html.replace(/<\/?span\b[^>]*>/g, '');
}

test('Python keywords, builtins, numbers, strings, comments, and functions are highlighted', () => {
  const html = highlight('# Example\ndef estimate():\n    return print("pi", 3.14)\n');
  for (const token of ['keyword', 'built_in', 'number', 'string', 'comment']) {
    assert.ok(html.includes(`class="hljs-${token}"`), `missing ${token} highlighting`);
  }
  assert.match(html, /class="hljs-title function_">estimate<\/span>/);
});

test('multiline strings and f-string expressions retain their text', () => {
  const source = 'message = """first\nsecond"""\nprint(f"value: {3.14}")\n';
  const html = highlight(source);
  assert.match(html, /class="hljs-string">&quot;&quot;&quot;first\nsecond/);
  assert.match(html, /class="hljs-subst"/);
  assert.equal(withoutSpans(html).replaceAll('&quot;', '"'), source);
});

test('indentation, tabs, blank lines, and trailing newlines are preserved', () => {
  const source = ['\nif True:\n', '\tvalue = 42  \n', '\n    pass\n\n'];
  assert.equal(withoutSpans(highlight(source)), source.join(''));
  assert.equal(highlight(''), '');
});

test('HTML-like source is escaped instead of creating elements', () => {
  const html = highlight('print("<script>alert(1)</script> & <img src=x onerror=alert(1)>")');
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.ok(html.includes('&amp; &lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!/<script|<img/.test(html));
});

test('only code cells are highlighted and retain their original cell indices', () => {
  const cells: NotebookCell[] = [
    { cell_type: 'markdown', source: '## Introduction' },
    { cell_type: 'code', source: 'value = 1' },
    { cell_type: 'raw', source: '<raw text>' },
    { cell_type: 'code', source: '' },
  ];
  const original = structuredClone(cells);
  const highlighted = highlightNotebookSources(cells);
  assert.deepEqual(Object.keys(highlighted), ['1', '3']);
  assert.equal(highlighted[3], '');
  assert.deepEqual(cells, original);
});

test('variables, attributes, and function calls have distinct scopes', () => {
  const source = 'estimate = calculate(math.pi) + rng.random()\n';
  const html = highlight(source);
  assert.match(html, /class="hljs-variable">estimate<\/span>/);
  assert.match(html, /class="hljs-property">pi<\/span>/);
  for (const name of ['calculate', 'random']) {
    assert.ok(html.includes(`class="hljs-title function_ call__">${name}</span>`));
  }
  assert.match(html, /class="hljs-operator">\+<\/span>/);
  assert.match(html, /class="hljs-punctuation">\(<\/span>/);
  assert.equal(withoutSpans(html), source);
});

test('operators use complete tokens and keyword-like names stay variables', () => {
  const source = 'Falsehood = print_result ** 2 // 3\nready = value != None\n';
  const html = highlight(source);
  assert.match(html, /class="hljs-operator">\*\*<\/span>/);
  assert.match(html, /class="hljs-operator">\/\/<\/span>/);
  assert.match(html, /class="hljs-operator">!=<\/span>/);
  assert.match(html, /class="hljs-variable">Falsehood<\/span>/);
  assert.match(html, /class="hljs-variable">print_result<\/span>/);
  assert.match(html, /class="hljs-literal">None<\/span>/);
  assert.equal(withoutSpans(html), source);
});

test('parameters, annotations, classes, decorators, and builtins remain highlighted', () => {
  const source =
    '@cache\nclass Estimator:\n    def calculate(self, points: Optional[int], scale=4):\n        return len(points) * self.scale\n';
  const html = highlight(source);
  assert.match(html, /class="hljs-meta">@cache<\/span>/);
  assert.match(html, /class="hljs-title class_">Estimator<\/span>/);
  assert.match(html, /class="hljs-params"/);
  assert.match(html, /class="hljs-variable">points<\/span>/);
  assert.match(html, /class="hljs-type">Optional<\/span>/);
  assert.match(html, /class="hljs-built_in">int<\/span>/);
  assert.match(html, /class="hljs-built_in">len<\/span>/);
  assert.match(html, /class="hljs-keyword">return<\/span>/);
  assert.match(html, /class="hljs-variable language_">self<\/span>/);
  assert.equal(withoutSpans(html), source);
});

test('detailed expression highlighting extends into f-string substitutions', () => {
  const source = 'print(f"estimate: {calculate(math.pi) + offset}")\n';
  const html = highlight(source);
  assert.match(html, /class="hljs-subst"/);
  assert.match(html, /class="hljs-title function_ call__">calculate<\/span>/);
  assert.match(html, /class="hljs-property">pi<\/span>/);
  assert.match(html, /class="hljs-variable">offset<\/span>/);
  assert.match(html, /class="hljs-operator">\+<\/span>/);
  assert.equal(withoutSpans(html).replaceAll('&quot;', '"'), source);
});

test('ordinary strings and comments do not highlight expression-like contents', () => {
  const html = highlight('# value.method() + other\nmessage = "value.method() + other"\n');
  assert.match(html, /class="hljs-comment"># value\.method\(\) \+ other<\/span>/);
  assert.match(html, /class="hljs-string">&quot;value\.method\(\) \+ other&quot;<\/span>/);
  assert.ok(!html.includes('hljs-property'));
  assert.ok(!html.includes('function_ call__'));
});

test('Unicode Python names preserve their full identifier boundaries', () => {
  const source = 'résultat = modèle.calculer(π)\n';
  const html = highlight(source);
  assert.match(html, /class="hljs-variable">résultat<\/span>/);
  assert.match(html, /class="hljs-title function_ call__">calculer<\/span>/);
  assert.match(html, /class="hljs-variable">π<\/span>/);
  assert.equal(withoutSpans(html), source);
});
