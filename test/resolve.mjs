import {existsSync} from 'node:fs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {dirname, join, resolve as resolvePath} from 'node:path';

/**
 * Module resolution hook for `node --test`.
 *
 * Node runs the app's TypeScript directly (type stripping is on by default in
 * Node 22), but it resolves modules the way the spec says: extensions are
 * required and `~/` means nothing. Vite is more forgiving, so app code is
 * written the Vite way. This bridges the two rather than making production
 * imports uglier to suit the test runner.
 */
const APP = resolvePath(dirname(fileURLToPath(import.meta.url)), '..', 'app');
const EXTENSIONS = ['.ts', '.tsx', '.js'];

export async function resolve(specifier, context, nextResolve) {
  let target = specifier;

  // `~/lib/thing` → the app directory, matching tsconfig's paths.
  if (target.startsWith('~/')) {
    target = pathToFileURL(join(APP, target.slice(2))).href;
  }

  try {
    return await nextResolve(target, context);
  } catch (error) {
    // Extensionless relative import: try the ones the app actually uses.
    const base =
      target.startsWith('.') && context.parentURL
        ? new URL(target, context.parentURL)
        : new URL(target);

    for (const extension of EXTENSIONS) {
      const candidate = new URL(base.href + extension);
      if (existsSync(fileURLToPath(candidate))) {
        return nextResolve(candidate.href, context);
      }
    }
    throw error;
  }
}
