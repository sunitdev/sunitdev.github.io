import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { posts } from '../content/posts';
import { prepareNotebooks } from './notebook-publication';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const selected = await prepareNotebooks({
  posts,
  sourceDirectory: resolve(scriptDirectory, '../../../notebooks'),
  outputDirectory: resolve(scriptDirectory, '../public/notebooks'),
});
console.log(`Prepared ${selected.length} published notebook(s).`);
