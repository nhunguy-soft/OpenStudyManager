# Contributing Guidelines

## Bug Reports 🐛

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Provide a step-by-step description of the suggested enhancement
- Provide specific examples to demonstrate the steps
- Describe the current behavior and explain the behavior you expected to see
- Explain why this enhancement would be useful

## Pull Requests 🚀

1. Fork the repo and create your branch from `main`
1. If you've added code that should be tested, add tests
1. If you've changed APIs, update the documentation
1. Ensure the test suite passes
1. Make sure your code lints
1. Issue that pull request!

## Development Process

1. Clone the repository

```bash
git clone https://github.com/yourusername/studymate.git
cd studymate
```

1. Install dependencies

```bash
npm install
# or
yarn install
```

1. Create a branch

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-fix
```

1. Commit changes

```bash
git add .
git commit -m "My commit message"
```

1. Push to the branch

```bash
git push origin feature/my-feature
# or
git push origin fix/my-fix
```

1. Open a Pull Request

## Style Guide

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript/TypeScript Style Guide

- Use TypeScript for new code
- Follow the existing code style
- Use meaningful variable names
- Add comments for complex logic
- Write self-documenting code where possible

### Component Guidelines

- One component per file
- Use functional components with hooks
- Keep components focused and small
- Use TypeScript interfaces for props
- Document complex prop types

### Testing

- Write unit tests for new features
- Update tests when modifying existing features
- Run the test suite before submitting PRs

### Continuous Integration

Run the test suite before pushing:

```bash
npm test
```

Documentation:

- Update the README.md if needed
- Document new features
- Keep code comments up to date
- Add JSDoc comments for functions

Questions?
Feel free to open an issue with your question or contact the maintainers directly.

Thank you for contributing! 🙏
