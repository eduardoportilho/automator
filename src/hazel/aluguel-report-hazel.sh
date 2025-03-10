# Deleting after replacing:

# source /Users/eduardoportilho/dev/personal/automator/src/hazel/aluguel-report-hazel.sh

# With:

# source /Users/eduardoportilho/dev/personal/automator/src/hazel/run_automator_script.sh $1 aluguel-report-to-sheets.ts


# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - AUTOMATOR_SCRIPTS_PATH
# - HAZEL_LOG_FILE

source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo "Rule [aluguel-report] executed at: $(date)" >> $HAZEL_LOG_FILE
echo "Input file: $1" >> $HAZEL_LOG_FILE

# Echo command for debbuging
echo "" >> $HAZEL_LOG_FILE
echo "$AUTOMATOR_SCRIPTS_PATH/aluguel-report.ts $1" >> $HAZEL_LOG_FILE
echo "" >> $HAZEL_LOG_FILE

# Execute command
$AUTOMATOR_SCRIPTS_PATH/aluguel-report.ts $1 >> $HAZEL_LOG_FILE 2>&1

echo "Rule finished" >> $HAZEL_LOG_FILE
