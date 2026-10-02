import type { LanguageFn, Mode } from 'highlight.js';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import { cellText, type NotebookCell } from './notebook-format';

// Used by the server-rendered post page; no highlighter is needed in the browser.
const highlighter = hljs.newInstance();
const detailedPython: LanguageFn = (api) => {
  const language = python(api);
  const reserved = new Set(
    Object.values(language.keywords ?? {})
      .flatMap((words) =>
        typeof words === 'string' ? words.split(/\s+/) : Array.isArray(words) ? words : [],
      )
      .map((word) => word.split('|')[0]),
  );
  const identifier = /(?<![\p{XID_Continue}])[\p{XID_Start}_]\p{XID_Continue}*/u;
  const ordinaryName: Mode['on:begin'] = (match, response) => {
    if (reserved.has(match[0])) response.ignoreMatch();
  };
  const expressions: Mode[] = [
    {
      match: [/\./, /[\t ]*/, /[\p{XID_Start}_]\p{XID_Continue}*(?=[\t ]*\()/u],
      scope: { 1: 'punctuation', 3: 'title.function.call' },
    },
    {
      match: [/\./, /[\t ]*/, /[\p{XID_Start}_]\p{XID_Continue}*/u],
      scope: { 1: 'punctuation', 3: 'property' },
    },
    {
      match: /(?<![\p{XID_Continue}])[\p{XID_Start}_]\p{XID_Continue}*(?=[\t ]*\()/u,
      scope: 'title.function.call',
      'on:begin': ordinaryName,
    },
    {
      match: /\*\*=?|\/\/=?|<<=?|>>=?|:=|->|[+\-*/%@&|^]=?|[!=<>]=?|~/,
      scope: 'operator',
    },
    { match: identifier, scope: 'variable', 'on:begin': ordinaryName },
  ];

  // Extend expression contexts only, so comments and string contents stay intact.
  const visited = new Set<Mode>();
  function extend(mode: Mode) {
    if (visited.has(mode)) return;
    visited.add(mode);
    for (const child of [...(mode.contains ?? []), ...(mode.variants ?? [])]) {
      if (child !== 'self') extend(child);
    }
    if (mode.className === 'subst') {
      mode.contains?.push(...expressions);
      mode.beginScope = 'punctuation';
      mode.endScope = 'punctuation';
    }
    if (mode.className === 'params') {
      for (const variant of mode.variants ?? []) variant.contains?.push(...expressions);
    }
  }
  for (const mode of language.contains) extend(mode);
  language.contains.push(...expressions, { match: /[()[\]{},.:;]/, scope: 'punctuation' });
  return language;
};
highlighter.registerLanguage('python', detailedPython);

export function highlightNotebookSources(cells: NotebookCell[]): Record<number, string> {
  return Object.fromEntries(
    cells.flatMap((cell, index) =>
      cell.cell_type === 'code'
        ? [
            [
              index,
              highlighter.highlight(cellText(cell.source), {
                language: 'python',
                ignoreIllegals: true,
              }).value,
            ],
          ]
        : [],
    ),
  );
}
