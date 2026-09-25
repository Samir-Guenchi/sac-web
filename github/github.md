# GitHub Workflow & Version Control Manual — ZAPHIRA

> **Repository Standard**: Strict branch-based feature workflow, conventional commits, disciplined PR documentation, and non-destructive Git operations.

---

## 1. Branch Strategy & Task Initialization

All development must occur on dedicated, short-lived topic branches branched off an up-to-date `main`. **Never commit directly to `main` unless explicitly instructed.**

### Step-by-Step Task Initialization
```bash
# 1. Ensure working directory is clean
git status

# 2. Switch to main and sync with upstream
git checkout main
git pull origin main

# 3. Create and switch to a new topic branch
git checkout -b <type>/<short-description>
```

### Standard Branch Naming Prefixes
| Prefix | Usage | Example |
| :--- | :--- | :--- |
| `feature/` | New user-facing feature or enhancement | `feature/customizer-3d-pearl-preview` |
| `fix/` | Bug fixes or correction of unexpected behavior | `fix/cart-currency-rounding-eur` |
| `refactor/` | Code refactoring without changing user behavior | `refactor/navbar-observer-cleanup` |
| `docs/` | Documentation additions or updates | `docs/workflow-and-agent-manual` |
| `test/` | Adding automated or visual verification scripts | `test/checkout-form-validation` |
| `chore/` | Maintenance tasks, asset organization, config | `chore/asset-path-consolidation` |

---

## 2. Development Hygiene

During development, maintain laser focus on the task objectives:
- **Inspect working state regularly**:
  ```bash
  git status
  git diff
  ```
- **Keep changes atomic**: Avoid combining unrelated tasks (e.g. implementing a new customizer option + refactoring the footer + reformatting CSS).
- **Preserve working files**: Do not leave temporary scratch files or commented-out debris in the commit history.

---

## 3. Pre-Commit Verification

Because ZAPHIRA is a Vanilla frontend without a Node build pipeline, rigorous manual verification is essential before staging any commit:

1. **Local HTTP Server**: Test the app via a local HTTP server (e.g. `npx serve .` or VS Code Live Server) to verify ES modules load without CORS errors.
2. **Browser Console & Network**: Verify 0 console errors, 0 warnings, and 0 failing HTTP 404 network requests.
3. **Core User Flows**:
   - **Cart Lifecycle**: Add off-the-shelf product → add customizer creation → verify drawer update → verify `panier.html` totals → test quantity adjustment and deletion.
   - **Customizer Studio**: Change color → change material → update monogram initials → verify live preview and dynamic price computation.
   - **Multilingual (i18n)**: Switch between `FR`, `EN`, and `AR` (verify Arabic displays with `dir="rtl"`).
   - **Currency Conversion**: Switch between `DZD`, `EUR`, and `USD` (verify all displayed prices update correctly).
   - **Checkout**: Fill delivery details → select Algerian Wilaya → submit simulated order.
   - **Account Onboarding**: Test email entry → verification code simulation → live password criteria checklist.
4. **Responsive Testing**: Verify on Desktop (1440px), Tablet (1024px, 768px), and Mobile (375px).

---

## 4. Staging & Commit Workflow

### Staging Rules
- **Stage deliberately**: Never use blind `git add .` or `git add -A`. Stage only files directly pertinent to the task:
  ```bash
  git add js/components/customizer.js css/customizer.css
  ```
- **Inspect staged changes**:
  ```bash
  git diff --cached
  ```

### Commit Formatting (Conventional Commits)
Commits must be descriptive, concise, and adhere to the Conventional Commits specification:

```text
<type>(<scope>): <concise present-tense description>
```

#### Approved Commit Types
- `feat:` A new feature or capability
- `fix:` A bug fix
- `refactor:` Code changes that neither fix a bug nor add a feature
- `docs:` Documentation changes only
- `style:` Formatting, whitespace, semicolon corrections (no code logic change)
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Tooling, repository maintenance, or asset updates

#### Commit Examples
```bash
git commit -m "feat(customizer): add 24k gold foil monogram hot-stamping option"
git commit -m "fix(cart): prevent zero quantity item persistence in localStorage"
git commit -m "docs(agents): create comprehensive agent architecture manual"
```

> [!CAUTION]
> **Forbidden Commit Messages**: Never use vague, single-word, or uninformative messages like `update`, `final`, `fixes`, `stuff`, `test`, or `wip`.

---

## 5. Pushing to Remote

Push your topic branch to the remote repository and establish tracking:
```bash
git push -u origin <branch-name>
```

---

## 6. Pull Request (PR) Standard

When opening a Pull Request from `<branch-name>` into `main`, provide a structured, comprehensive description:

```markdown
## Summary
<Concise overview of what this pull request accomplishes.>

## Motivation
<Why is this change necessary? What problem or user requirement does it address?>

## Implementation
<Bullet-point breakdown of architectural and technical changes made across files.>

## Files Changed
- `path/to/file1`: Summary of changes
- `path/to/file2`: Summary of changes

## Testing
- [x] Local HTTP server verification
- [x] Console log inspection (0 errors, 0 warnings)
- [x] Responsive layout verified on mobile (375px) and desktop (1440px)
- [x] Arabic RTL verified
- [x] Shopping bag persistence verified across page reloads

## Limitations & Follow-Up
<Note any trade-offs, temporary prototype aspects, or recommended future work.>
```

*Before submitting the PR, inspect the full diff in the GitHub UI or via `git diff main...<branch-name>` to ensure no stray changes or debug statements were included.*

---

## 7. Review & Revision Cycle

When review comments or feedback require updates:
1. Stay on the **same topic branch** (do not open a new branch for PR review fixes).
2. Implement the requested adjustments.
3. Test thoroughly.
4. Commit using clear messages (e.g., `fix(customizer): refine mobile preview stage padding`).
5. Push to the same branch (`git push origin <branch-name>`). GitHub will automatically update the open Pull Request.

---

## 8. Merge & Cleanup Workflow

Once approved and all checks pass:
1. Merge the Pull Request into `main` (via GitHub interface using "Squash and merge" or "Rebase and merge" per team standard).
2. Locally switch to `main` and pull the latest changes:
   ```bash
   git checkout main
   git pull origin main
   ```
3. Safely delete the local branch:
   ```bash
   git branch -d <branch-name>
   ```
4. If the remote branch was not automatically deleted by GitHub, delete it:
   ```bash
   git push origin --delete <branch-name>
   ```

---

## 9. Git Safety & Destructive Command Restrictions

> [!CAUTION]
> **Strict Safety Directives**:
> 1. **NEVER force push to `main`**: `git push --force origin main` or `git push -f origin main` is strictly prohibited.
> 2. **NEVER casually run destructive commands**:
>    - `git reset --hard` (destroys uncommitted working directory changes)
>    - `git clean -fd` (permanently deletes untracked files without recovery)
>    - `git checkout -- .` or `git restore .` (discards working tree modifications)
> 3. **Inspect before advanced operations**: Before executing `git rebase`, `git merge`, `git cherry-pick`, or `git reset`, always check:
>    ```bash
>    git status
>    git branch
>    git log -n 5 --oneline
>    git diff
>    ```
> 4. **Never overwrite another contributor's commits** without explicit, documented coordination.
