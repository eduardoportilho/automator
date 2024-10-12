# Hazel

## Set Up

1. Create `/Users/eduardoportilho/hazel/.hazelenv` file (adjust `src/hazel/.hazelenv` accordingly)
2. Add rule with the action "Run shell script" - "embedded script"
3. Edit script add the following line:

```sh
source /Users/eduardoportilho/dev/personal/automator/src/hazel/extrato-itau-to-ynab-hazel.sh
```

## Shell Script cheat sheet

- Excecute file, loading env vars:
  `source .env`
- Write content to a file (replacing existing content):
  `echo "content" > file.txt`
- Write content to a file (appending content):
  `echo "content" >> file.txt`
- Execute command redirecting STDOUT and STDERR to file:
  `./command.sh >> file.txt 2>&1`

## Hazel tips

- [Hazel Debug Mode](https://www.noodlesoft.com/kb/hazel-debug-mode/)
