import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { join } from 'node:path';

const root = process.cwd();

function readProjectFile(path: string) {
  return readFileSync(join(root, path), 'utf8');
}

test('app shell exposes skip link and visible primary navigation', () => {
  const shell = readProjectFile('src/shared/components/dashboard-shell.tsx');
  const navbar = readProjectFile('src/modules/auth/components/navbar.tsx');

  assert.match(shell, /href="#main-content"/);
  assert.match(shell, /id="main-content"/);
  assert.match(navbar, /AppNavLinks/);
  assert.match(navbar, /aria-label="Выйти из аккаунта"/);
});

test('global focus styles preserve keyboard visibility', () => {
  const globals = readProjectFile('src/app/globals.css');

  assert.doesNotMatch(globals, /a:focus-visible\s*{\s*outline:\s*none;\s*}/);
  assert.match(globals, /:where\(a, button, input, select, textarea/);
  assert.match(globals, /box-shadow: 0 0 0 2px var\(--primary\)/);
  assert.match(globals, /--font-mono: var\(--font-jetbrains-mono\)/);
});

test('startup routes include loading skeletons', () => {
  assert.equal(existsSync(join(root, 'src/app/startups/loading.tsx')), true);
  assert.equal(existsSync(join(root, 'src/app/startups/[id]/loading.tsx')), true);
});

test('startup table distinguishes empty catalog from empty filtered results', () => {
  const page = readProjectFile('src/app/startups/page.tsx');
  const table = readProjectFile('src/modules/startups/components/startup-table.tsx');

  assert.match(page, /hasActiveFilters/);
  assert.match(table, /hasActiveFilters/);
  assert.match(table, /Сбросить фильтры/);
  assert.match(table, /scope="col"/);
});

test('filters expose accessible sort state and reset/search affordances', () => {
  const filters = readProjectFile('src/modules/startups/components/startup-filters.tsx');

  assert.match(filters, /aria-pressed/);
  assert.match(filters, /Сбросить/);
  assert.match(filters, /bg-background-soft/);
});

test('auth forms expose pending submit states and live alerts', () => {
  const login = readProjectFile('src/app/(auth)/login/page.tsx');
  const register = readProjectFile('src/modules/auth/components/register-form.tsx');
  const submitButton = readProjectFile(
    'src/modules/auth/components/auth-submit-button.tsx',
  );

  assert.match(login, /LoginSubmitButton/);
  assert.match(login, /role="alert"/);
  assert.match(register, /RegisterSubmitButton/);
  assert.match(register, /minLength=\{10\}/);
  assert.match(submitButton, /useFormStatus/);
  assert.match(submitButton, /aria-busy/);
});

test('vote panel applies success flash and complete pressed semantics', () => {
  const votePanel = readProjectFile('src/modules/startups/components/vote-panel.tsx');

  assert.match(votePanel, /vote-flash-animation/);
  assert.match(votePanel, /aria-live="polite"/);
  assert.match(votePanel, /aria-pressed={localVote === 1}/);
  assert.match(votePanel, /aria-pressed={localVote === -1}/);
});

test('detail and pending pages give users orientation and next steps', () => {
  const detail = readProjectFile('src/app/startups/[id]/page.tsx');
  const pending = readProjectFile('src/app/pending/page.tsx');

  assert.match(detail, /aria-label="Хлебные крошки"/);
  assert.match(detail, /Стартапы/);
  assert.match(pending, /Обычно это занимает/);
  assert.match(pending, /signOutAction/);
});
