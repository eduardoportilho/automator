#!/bin/zsh

# Required environment variables:
# - $AUTOMATOR_SCRIPTS_PATH
# - $HAZEL_LOG_FILE
# Optional environment variables:
# - KMVAR_RUN_ONCE_A_DAY

# --- \ Load environment variables / --- #
# Set $PATH
source /Users/eduardoportilho/dev/personal/automator/src/keyboard-maestro/env.sh
# Set secrets
source /Users/eduardoportilho/dev/personal/automator/.envrc
# --- / Load environment variables \ --- #

echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo "\"run_automator_script.sh\" script executed at: $(date +%d/%m/%Y-%H:%M:%S)" >> $HAZEL_LOG_FILE

# --- \ Echo $PATH for debbuging / --- #
# echo "" >> $HAZEL_LOG_FILE
# echo "Path: $PATH" >> $HAZEL_LOG_FILE
# echo "" >> $HAZEL_LOG_FILE
# --- / Echo $PATH for debbuging \ --- #


# --- \ Log important variables / --- #
# https://wiki.keyboardmaestro.com/action/Execute_a_Shell_Script#Execute_a_Shell_Script
# Script file name - should exist in $AUTOMATOR_SCRIPTS_PATH (`/src/scripts``)
echo "- Keyboard Maestro Macro: [$KMINFO_MacroName]" >> $HAZEL_LOG_FILE
echo "- Automator script to run: [$KMVAR_AUTOMATOR_SCRIPT]" >> $HAZEL_LOG_FILE
echo "- Run once a day? [$KMVAR_RUN_ONCE_A_DAY]" >> $HAZEL_LOG_FILE
echo "- Add path to args? [$KMVAR_AddPathToArgs]" >> $HAZEL_LOG_FILE
echo "- Env vars to use as script arguments: [$KMVAR_EnvToArgs]" >> $HAZEL_LOG_FILE
# --- / Log important variables \ --- #

arguments=()

# --- \ Add path to args / --- #
if [[ $KMVAR_AddPathToArgs = "true" ]]; then
# KMVAR_Path contains the path of the selected file in finder (https://wiki.keyboardmaestro.com/collection/Finders_Selection)
# Obs: "Path" is set in KM UI
  echo "- Selected file in finder (KMVAR_Path): [$KMVAR_Path]" >> $HAZEL_LOG_FILE
  arguments+=($KMVAR_Path)
fi
# --- / Add path to args \ --- #

# --- \ Pass env vars as args / --- #
# `-n` -> $KMVAR_EnvToArgs is not empty
if [ -n $KMVAR_EnvToArgs ]; then
  # Split value with separator `,`
  envVarNames=(${(s<,>)KMVAR_EnvToArgs})
  for envVarName in $envVarNames; do
    arguments+=(${(P)envVarName})
  done
fi
# --- / Pass env vars as args \ --- #

echo "" >> $HAZEL_LOG_FILE

# --- \ Echo command for debbuging / --- #
# echo "$AUTOMATOR_SCRIPTS_PATH/$KMVAR_AUTOMATOR_SCRIPT" $arguments >> $HAZEL_LOG_FILE
# echo "" >> $HAZEL_LOG_FILE
# --- / Echo command for debbuging \ --- #

# Execute command
$AUTOMATOR_SCRIPTS_PATH/$KMVAR_AUTOMATOR_SCRIPT $arguments>> $HAZEL_LOG_FILE 2>&1

echo "" >> $HAZEL_LOG_FILE

echo "Script finished" >> $HAZEL_LOG_FILE
