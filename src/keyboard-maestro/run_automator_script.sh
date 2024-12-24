# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - AUTOMATOR_SCRIPTS_PATH
# - HAZEL_LOG_FILE

source /Users/eduardoportilho/dev/personal/automator/src/keyboard-maestro/env.sh
source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo ""run_automator_script.sh" Shell Script action executed at: $(date)" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE

echo "Path: $PATH" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE
# KMVAR_Path contains the path of the selected file in finder (https://wiki.keyboardmaestro.com/collection/Finders_Selection)
# Obs: "Path" is set in KM UI
echo "Selected file in finder (KMVAR_Path): [$KMVAR_Path]" >> $HAZEL_LOG_FILE
echo "Automator script to be executed (KMVAR_AUTOMATOR_SCRIPT): [$KMVAR_AUTOMATOR_SCRIPT]" >> $HAZEL_LOG_FILE

# Is -ld "$KMVAR_Path"

# Echo command for debbuging
# echo "" >> $HAZEL_LOG_FILE
# echo "$AUTOMATOR_SCRIPTS_PATH/$KMVAR_AUTOMATOR_SCRIPT" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE

# Execute command
$AUTOMATOR_SCRIPTS_PATH/$KMVAR_AUTOMATOR_SCRIPT >> $HAZEL_LOG_FILE 2>&1

echo "" >> $HAZEL_LOG_FILE

echo "Script finished" >> $HAZEL_LOG_FILE
