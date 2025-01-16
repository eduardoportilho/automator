# Shell Tips and Trips

- https://hcsonline.com/images/PDFs/Scripting_Intro_Zsh.pdf
- https://helpful.wiki/zsh/
- https://gist.github.com/ClementNerma/1dd94cb0f1884b9c20d1ba0037bdcde2

## Script arguments

- `$0`: script file name
- `$1`, `$2`, ...: arg 1, arg 2,...
- `$#`: number of arguments
- `$@`: space delimited string of all arguments

## Redirection

File descriptors:

- stdin (the keyboard) - File Descriptor Number 0
- stdout (the screen) - File Descriptor Number 1
- stderr (error messages output to the screen) - File Descriptor Number 2

Commands:

- `>`: Redirects (replace)
- `>>`: Redirects (append)
- `2>&1`: Redirect stderr and stdout to a log file (ex: `ls -alh /tnt > mylogfile.txt 2>&1`)
- `|`: Redirects output from left to input on right
  - `ls -alh /tnt 2>&1 | tee screenAndLog.txt`: This command will send stdout and stderr to both the screen and to a file using a pipe for redirection and the tee command.
  - `ls -alh /tnt 2>&1 | tee >> screenAndLog.txt`: This command will append stdout and stderr to both the screen and to a file using a pipe for redirection and the tee command.

## Substitution

- `a=$(ls -alh)`: Store the output of the command in a variable

## Array:

- New array: `array=()` / `array=(1 2 3 4 5)`
- Print one item per row: `print -l $array`
- Slice: `${array[@]:start:end}`
  - You can omit the `end` or use negative indices
  - Ex - from idx 2 til end: `${array[@]:2}`

## For loop

```zsh
for i in $( ls ); do
echo item: $i
done
```

## Conditionals:

- `[]` vs. `[[ ]]`:
  - `[[` prevents word splitting of variable values. So, if `VAR="var withspaces"`, you do not need to double quote `$VAR` in a test.
  - `[[` prevents pathname expansion, so literal strings with wildcards do not try to expand to filenames. Using `[[`, `==` and `!=` interpret strings to the right as shell glob patterns to be matched against the value to the left, for instance: `[[ "value" == val* ]]`.

### If / elif / else

```zsh
if [ $count -eq 100 ]; then
  echo "Count is 100"
elif [ $count -gt 100 ]; then
  echo "Count is greater than 100"
else;
  echo "Count is not 100"
fi
```

### Check if variable is empty:

```zsh
# [ -z STRING ] True of the length if "STRING" is zero
if [ -z $UNKNOWN ]; then
  echo "\$UNKNOWN is empty"
fi

# [ -n STRING ] True of the length if "STRING" is not zero
if [ -n $HOME ]; then
  echo "\$HOME is not empty, \$HOME is $HOME"
fi
```

## Indirect variable reference:

or, "How to read the value of a variable given its name in a string":
(https://linux.die.net/man/1/zshexpn -> Parameter Expansion Flags)

```zsh
VAR1="VAR2"
VAR2='Indirect Redirection'
VAR3=${(P)VAR1}
echo $VAR3
# Indirect Redirection
```

## Misc:

### Split string:

```zsh
STRING="ENV_1:ENV_2"
# `:` is the delimiter
ARRAY=(${(s<:>)STRING})
# Print one item per row
print -l $ARRAY
```

### Dynamically read value of variables (var name is stored in string):

```zsh
ENV_1="Hello world"
ENV_2="Foo Bar"
VAR_NAMES="ENV_1 ENV_2"

# Empty array
values=()

# Check if var is not empty
if [ -n $VAR_NAMES ]; then;
  # Split the string into an array
  VAR_NAMES_ARRAY=(${(s< >)VAR_NAMES})

  for varName in $VAR_NAMES_ARRAY; do
    value=${(P)varName}
    values+=($value)
    echo "Var name: $varName" ; echo "Value: $value"
  done
fi
# You can pass values as argument to another script, eg. `script.sh $values`
echo "Values: $values"
```

### Format a date

```zsh
echo "Last update at: $(date +%d/%m/%Y-%H:%M:%S)"

```
