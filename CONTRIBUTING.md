# Contributing

First off, thank you for considering contributing to this project. It's people like you that make this project such a great tool.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for this project. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for this project, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion and make decisions.

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.

### Your First Code Contribution

Unsure where to begin contributing to this project? You can start by looking through these `beginner` and `help-wanted` issues:

- `Beginner issues` - issues which should only require a few lines of code, and a test or two.
- `Help wanted issues` - issues which should be a bit more involved than `beginner` issues.

### Pull Requests

The process described here has several goals:

- Maintain the project's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible project
- Enable a sustainable system for the project's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Fork the project, clone your fork, and configure the remotes.
2. If you cloned a while ago, get the latest changes from upstream.
3. Create a new topic branch (off the main project development branch) to contain your feature, change, or fix.
4. Make sure that your changes adhere to the current coding conventions used throughout the project - indentation, accurate comments, etc.
5. Commit your changes in logical chunks. Use the project's commit conventions. If the project uses the [Angular commit conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines), your commit message header should look something like this:

   ```
   <type>: <short summary>
   ```

   Please ensure your commit message clearly describes the nature of the change. This helps reviewers to understand your pull request and aids in seamless integration.

   **Note**: Instead of using `git commit`, use `npm run commit` to commit your changes. This ensures your changes are tagged correctly with semantic release.

6. Locally merge (or rebase) the upstream development branch into your topic branch.
7. Push your topic branch up to your fork.
8. Open a Pull Request with a clear title and description.

## Semantic Release

This project uses [semantic release](https://semantic-release.gitbook.io/semantic-release/) for automated version management and package publishing. It uses the commit messages to determine the type of changes in the codebase. Following formalized conventions for commit messages, semantic release automatically determines the next semantic version number, generates a changelog and publishes the release.

The commit message conventions are as follows:

- `fix`: a commit of the type `fix` patches a bug in your codebase (this correlates with `PATCH` in semantic versioning).
- `feat`: a commit of the type `feat` introduces a new feature to the codebase (this correlates with `MINOR` in semantic versioning).
- `BREAKING CHANGE`: a commit that has a footer `BREAKING CHANGE:`, or appends a `!` after the type/scope, introduces a breaking API change (correlating with `MAJOR` in semantic versioning). A BREAKING CHANGE can be part of commits of any type.

For more details, visit [semantic release documentation](https://semantic-release.gitbook.io/semantic-release/).

Thank you for your interest in contributing to our project!
