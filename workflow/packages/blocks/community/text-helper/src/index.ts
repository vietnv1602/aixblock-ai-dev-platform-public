import { PieceAuth, createPiece } from 'workflow-blocks-framework';
import { BlockCategory } from 'workflow-shared';
import { concat } from './lib/actions/concat';
import { defaultValue } from './lib/actions/default-value';
import { find } from './lib/actions/find';
import { htmlToMarkdown } from './lib/actions/html-to-markdown';
import { markdownToHTML } from './lib/actions/markdown-to-html';
import { replace } from './lib/actions/replace';
import { slugifyAction } from './lib/actions/slugify';
import { split } from './lib/actions/split';
import { stripHtmlContent } from './lib/actions/strip-html';

export const textHelper = createPiece({
  displayName: 'Text Helper',
  description: 'Tools for text processing',
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/text-helper.svg',
  authors: [
    'joeworkman',
    'kishanprmr',
    'MoShizzle',
    'AbdulTheActivePiecer',
    'abuaboud',
    'AdamSelene',
    'Anmol-Gup',
  ],
  categories: [BlockCategory.CORE],
  actions: [
    concat,
    replace,
    split,
    find,
    markdownToHTML,
    htmlToMarkdown,
    stripHtmlContent,
    slugifyAction,
    defaultValue,
  ],
  triggers: [],
});
