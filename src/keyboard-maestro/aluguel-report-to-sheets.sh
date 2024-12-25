# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - AUTOMATOR_SCRIPTS_PATH
# - HAZEL_LOG_FILE

source /Users/eduardoportilho/dev/personal/automator/src/keyboard-maestro/env.sh
source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo ""aluguel-report-to-sheets.sh" shell script action executed at: $(date)" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE

echo "Selected file on Finder: $KMVAR_Path" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE

# Echo command for debbuging
echo "" >> $HAZEL_LOG_FILE
echo "Command that will be executed:" >> $HAZEL_LOG_FILE
echo "$AUTOMATOR_SCRIPTS_PATH/aluguel-report-to-sheets.ts \"$KMVAR_Path\"" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE

# Execute command
$AUTOMATOR_SCRIPTS_PATH/aluguel-report-to-sheets.ts "$KMVAR_Path" >> $HAZEL_LOG_FILE 2>&1

echo "" >> $HAZEL_LOG_FILE

echo "Action finished" >> $HAZEL_LOG_FILE
