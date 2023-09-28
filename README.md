# SnapSync

SnapSync is a Metamask Snap that saves data from snaps across devices securely using IPFS.

# Integrate SnapSync into your Snaps

Check out the developer docs at https://snapsync.xyz

## Local development

Clone this repository and setup the development environment:

```shell
yarn install && yarn start
```

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
