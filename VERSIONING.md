# Versioning Guide

This repo uses independent semantic versioning through `semantic-release`, matching the Saafe release approach.

## Production Branch

Only `master` creates web application releases.

`semantic-release` will not publish a release from any other branch.

## Version Source

The version is stored in:

- `package.json`
- `package-lock.json`
- git tags in the format `vX.X.X`

The web app shows the version in the footer as a tiny `vX.X.X` label.

## One-Time Setup

This repo did not previously have semantic-release tags. After the semantic-release setup is committed and pushed, run this once from a clean `master` branch:

```sh
npm run release:init
```

This creates and pushes the initial tag for the current `package.json` version. After that, normal releases are fully automated with `npm run release`.

## Release Command

Run this from a clean working tree on `master`:

```sh
npm run release
```

The release command will:

1. Read commits since the latest `vX.X.X` tag.
2. Decide the next semantic version from commit messages.
3. Update `package.json`, `package-lock.json`, and `CHANGELOG.md`.
4. Commit the release as `chore(release): X.X.X [skip ci]`.
5. Create the git tag `vX.X.X`.
6. Push the release commit and tag.

The package is not published to npm. `.releaserc.json` sets `npmPublish: false`.

## Commit Rules

Use Conventional Commits:

```sh
feat: add catalog filters
fix: correct footer spacing
docs: update deployment notes
refactor: simplify product card layout
```

Version bump rules:

- `feat:` creates a minor release.
- `fix:` creates a patch release.
- `BREAKING CHANGE:` or `type!:` creates a major release.
- Other commit types are included in release notes when relevant but do not always create a new release.

## Useful Commands

```sh
npm run version:check
npm run release:dry
npm run release
```

Use `release:dry` to preview what semantic-release would do without creating a release.
