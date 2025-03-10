
# Instructions: Edit embedded scrit with the following call:
# 
# source /Users/eduardoportilho/dev/personal/automator/src/hazel/run_automator_script.sh \
#   $1 \
#   <automator-script-file-to-run.sh> \
#   <env-to-arg-1> \
#   <env-to-arg-2>
# 
# Example:
# `source /Users/eduardoportilho/dev/personal/automator/src/hazel/run_automator_script.sh $1 extrato-itau-to-ynab-post.ts BUDGET_EDU_2025 ACCOUNT_EDU_2025_ITAU_CONTA_EDU YNAB_ACCESS_TOKEN`

# Suppress deprecation warnings like "(node:21673) [DEP0040] DeprecationWarning: The `punycode` module is deprecated.""
# @see https://stackoverflow.com/questions/77587325/deprecationwarning-the-punycode-module-is-deprecated
export NODE_OPTIONS="--no-deprecation"

# --- \ Load environment variables / --- #
# Set secrets
source /Users/eduardoportilho/dev/personal/automator/.envrc
# --- / Load environment variables \ --- #


# --- \ Get variables from args / --- #
inputFile=$1
automatorScript=$2
# Env to args: remove the first 3 items (thisScript, inputFile, automatorScript) of the args array ($@)
envToArgs=${@[@]:3}
# --- / Get variables from args \ --- #

echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo "\"hazel\/run_automator_script.sh\" script executed at: $(date +%d/%m/%Y-%H:%M:%S)" >> $HAZEL_LOG_FILE

# --- \ Log important variables / --- #
echo "- Automator script to run: [$automatorScript]" >> $HAZEL_LOG_FILE
echo "- Input file: [$inputFile]" >> $HAZEL_LOG_FILE
echo "- Env vars to use as script arguments: [$envToArgs]" >> $HAZEL_LOG_FILE
# --- / Log important variables \ --- #

# --- \ Pass env vars as args / --- #
arguments=()
# `-n` -> $envToArgs is not empty
if [ -n $envToArgs ]; then
  # Split value with separator ` ` 🤷
  envVarNames=(${(s< >)envToArgs})
  for envVarName in $envVarNames; do
    # Get the value of the var by its name
    envVarValue=${(P)envVarName}
    # echo "  + $envVarName: $envVarValue" >> $HAZEL_LOG_FILE
    arguments+=($envVarValue)
  done
fi
# echo "- Env vars values to use as script arguments: [$arguments]" >> $HAZEL_LOG_FILE
# --- / Pass env vars as args \ --- #

echo "" >> $HAZEL_LOG_FILE

# --- \ Echo command for debbuging / --- #
# echo "$AUTOMATOR_SCRIPTS_PATH/$automatorScript $inputFile $arguments" >> $HAZEL_LOG_FILE
# echo "" >> $HAZEL_LOG_FILE
# --- / Echo command for debbuging \ --- #

# Execute command
$AUTOMATOR_SCRIPTS_PATH/$automatorScript $inputFile $arguments >> $HAZEL_LOG_FILE 2>&1
echo "" >> $HAZEL_LOG_FILE


echo "Script finished" >> $HAZEL_LOG_FILE