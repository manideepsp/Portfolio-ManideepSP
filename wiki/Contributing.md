# Contributing

Thank you for your interest in contributing to Portfolio-ManideepSP! This guide will help you get started with contributing to the project.

## 🎯 Ways to Contribute

There are many ways to contribute to this project:

- 🐛 **Report bugs** - Found a bug? Let us know!
- ✨ **Suggest features** - Have an idea? We'd love to hear it!
- 📝 **Improve documentation** - Help make the docs better
- 💻 **Submit code** - Fix bugs or add features
- 🎨 **Design improvements** - Enhance the UI/UX
- 🧪 **Write tests** - Improve code coverage
- 🌐 **Translations** - Help make it multilingual

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Git
- GitHub account

### Fork and Clone

1. **Fork the repository**
   - Click "Fork" button on GitHub
   - Creates a copy in your account

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Portfolio-ManideepSP.git
   cd Portfolio-ManideepSP
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/manideepsp/Portfolio-ManideepSP.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### 2. Make Your Changes

Follow these guidelines:

#### Code Style

- Use **2 spaces** for indentation
- Use **semicolons** in JavaScript
- Follow **ESLint** rules (run `npm run lint`)
- Use **meaningful variable names**
- Add **comments** for complex logic

**Example:**

```javascript
// ❌ Bad
const x = fetchData();
const y = x.map(z => z.name)

// ✅ Good
const projects = await fetchProjects();
const projectNames = projects.map(project => project.name);
```

#### Component Structure

```javascript
// Component template
import React from 'react';
import './Component.css';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display
 */
export default function Component({ title }) {
  return (
    <div className="component">
      <h2>{title}</h2>
    </div>
  );
}
```

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <description>

# Examples
feat(projects): add project filtering by technology
fix(contact): resolve CORS issue with worker
docs(wiki): add troubleshooting guide
style(header): improve mobile navigation
refactor(config): simplify configuration structure
test(contact): add form validation tests
chore(deps): update dependencies
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, styling
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance
- `perf`: Performance improvements

### 3. Test Your Changes

```bash
# Validate configuration
npm run validate

# Build the project
npm run build

# Preview build
npm run preview

# Check for errors
npm run lint  # If available
```

**Manual testing checklist:**
- [ ] All pages load without errors
- [ ] Changes work on mobile
- [ ] No console errors
- [ ] Contact form works (if modified)
- [ ] Resume viewer works (if modified)
- [ ] Navigation works
- [ ] Styling is consistent

### 4. Commit Your Changes

```bash
# Add files
git add .

# Commit with descriptive message
git commit -m "feat(projects): add project filtering by technology"

# Or use interactive commit
git add -p
git commit
```

### 5. Push to Your Fork

```bash
# Push your branch
git push origin feature/your-feature-name

# If you need to force push (use carefully!)
git push origin feature/your-feature-name --force
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template
4. Submit the pull request

## 📝 Pull Request Guidelines

### PR Title

Use conventional commit format:

```
feat(scope): add new feature
fix(scope): resolve bug
docs(scope): update documentation
```

### PR Description

Include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Changes Made
- Added feature X
- Fixed bug Y
- Updated documentation Z

## Screenshots (if applicable)
[Add screenshots here]

## Testing Done
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] No console errors
- [ ] Build passes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No breaking changes (or documented)
```

### PR Review Process

1. **Automated checks** run (build, lint, etc.)
2. **Code review** by maintainers
3. **Changes requested** (if needed)
4. **Approval** and merge

**What reviewers look for:**
- Code quality
- Follows guidelines
- Tests pass
- Documentation updated
- No breaking changes

## 🐛 Reporting Bugs

### Before Reporting

- Check [existing issues](https://github.com/manideepsp/Portfolio-ManideepSP/issues)
- Search [closed issues](https://github.com/manideepsp/Portfolio-ManideepSP/issues?q=is%3Aissue+is%3Aclosed)
- Try latest version
- Check [Troubleshooting](Troubleshooting) guide

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable, add screenshots

## Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96]
- Node version: [e.g., 18.0.0]
- npm version: [e.g., 8.0.0]

## Additional Context
Any other relevant information

## Possible Solution
(Optional) Suggest a fix
```

## ✨ Suggesting Features

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other solutions you've thought about

## Additional Context
Screenshots, mockups, examples

## Implementation Ideas
(Optional) How it could be implemented
```

## 📚 Documentation Contributions

Documentation is just as important as code!

### What to Document

- New features
- Configuration options
- API changes
- Common issues/solutions
- Examples and tutorials

### Documentation Style

- Use **clear, simple language**
- Include **code examples**
- Add **screenshots** where helpful
- Link to **related pages**
- Keep it **up to date**

### Updating Wiki

Wiki pages are in the `wiki/` directory:

```bash
# Edit wiki page
vim wiki/Getting-Started.md

# Commit changes
git add wiki/Getting-Started.md
git commit -m "docs(wiki): update installation steps"
```

## 🎨 Design Contributions

### Design Guidelines

- Follow existing color scheme (see `src/styles/vars.css`)
- Maintain dark theme aesthetic
- Ensure accessibility (WCAG AA)
- Test on mobile devices
- Use consistent spacing

### Submitting Designs

1. Create mockups (Figma, Sketch, etc.)
2. Open an issue with designs
3. Discuss with maintainers
4. Implement after approval

## 🧪 Writing Tests

### Test Structure

```javascript
// Example test (if tests are added)
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Manideep');
});
```

### Testing Guidelines

- Test user-facing behavior
- Test edge cases
- Keep tests simple and focused
- Use descriptive test names
- Mock external dependencies

## 🔍 Code Review

### Reviewing PRs

When reviewing others' PRs:

- ✅ Be respectful and constructive
- ✅ Point out both good and bad
- ✅ Explain why changes are needed
- ✅ Suggest solutions
- ❌ Don't be rude or dismissive
- ❌ Don't just say "bad code"

### Responding to Reviews

When your PR is reviewed:

- ✅ Thank reviewers
- ✅ Address all comments
- ✅ Ask questions if unclear
- ✅ Update PR description if scope changes
- ❌ Don't take it personally
- ❌ Don't ignore feedback

## 📜 Code of Conduct

### Our Standards

- **Be respectful** - Treat everyone with respect
- **Be inclusive** - Welcome all contributors
- **Be collaborative** - Work together
- **Be patient** - Help others learn
- **Be constructive** - Give helpful feedback

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing private information
- Other unprofessional conduct

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report issues to repository maintainers.

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📞 Getting Help

### Where to Ask

- **GitHub Issues** - Bug reports, feature requests
- **GitHub Discussions** - General questions, ideas
- **Discord/Slack** - Real-time chat (if available)

### Questions About Contributing

Not sure about something? Just ask!

- Open an issue with your question
- Tag it with `question` label
- Maintainers will respond

## 🎓 Learning Resources

### Helpful Links

- [Astro Documentation](https://docs.astro.build/)
- [React Documentation](https://react.dev/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### Example Contributions

Look at merged PRs to see examples:
- [Merged Pull Requests](https://github.com/manideepsp/Portfolio-ManideepSP/pulls?q=is%3Apr+is%3Amerged)

## 🚀 First-Time Contributors

### Good First Issues

Look for issues labeled:
- `good first issue`
- `beginner friendly`
- `documentation`
- `help wanted`

### Tips for First-Time Contributors

1. **Start small** - Fix typos, update docs
2. **Ask questions** - No question is too simple
3. **Learn from feedback** - Reviews are learning opportunities
4. **Be patient** - Reviews take time
5. **Have fun!** - Enjoy the process

## 🔄 Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Switch to main
git checkout main

# Merge upstream changes
git merge upstream/main

# Push to your fork
git push origin main
```

## ✅ Contribution Checklist

Before submitting a PR:

- [ ] Code follows style guidelines
- [ ] Tested locally (dev and build)
- [ ] No console errors
- [ ] Responsive design checked
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] PR description is complete
- [ ] No merge conflicts
- [ ] Screenshots added (if UI changes)
- [ ] Linked related issue

## 📈 Advanced Contributions

### Adding Dependencies

```bash
# Install new dependency
npm install package-name

# Update package.json and package-lock.json
git add package.json package-lock.json
git commit -m "chore(deps): add package-name"
```

**Before adding:**
- Is it necessary?
- Is it well-maintained?
- What's the bundle size impact?
- Are there alternatives?

### Performance Improvements

- Profile before and after
- Measure impact
- Document findings
- Add benchmark results to PR

### Breaking Changes

If your change is breaking:

1. **Document** in PR description
2. **Explain** why it's necessary
3. **Provide** migration guide
4. **Update** version accordingly

## 🎉 Thank You!

Every contribution matters, whether it's:
- Fixing a typo
- Reporting a bug
- Adding a feature
- Helping another contributor

**Thank you for making this project better!** 🙏

---

**Related**: [Getting Started](Getting-Started) • [Architecture](Architecture) • [Troubleshooting](Troubleshooting)
