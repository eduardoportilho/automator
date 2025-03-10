# Troubleshooting

### Debuging [carteira-xp-to-sheets.ts]

#### Preparation:

- .vscode/launch.json

```
"args": [
  "${workspaceFolder}/src/scripts/carteira-xp-to-sheets.ts",
  "/Users/eduardoportilho/Downloads/2025-03-w2/PosicaoDetalhada.xlsx",
]
```

#### Problems:

- Google authentication error
  - Make sure `private/google-credentials.json` is present and contais credentials
    - If not, copy `GOOGLE_CREDENTIALS` from 1password to `private/google-credentials.json`
  - Make sure `export GOOGLE_APPLICATION_CREDENTIALS=...` is present on `.envrc`
  - On terminal go to project dir, run `direnv allow` and restart vscode `code .`
  - Should work 🎉
