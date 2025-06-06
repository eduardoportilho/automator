# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - AUTOMATOR_SCRIPTS_PATH
# - HAZEL_LOG_FILE

source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo "Rule [hello-world] executed at: $(date)" >> $HAZEL_LOG_FILE
echo "Input file: $1" >> $HAZEL_LOG_FILE
echo "All args: $@" >> $HAZEL_LOG_FILE
# echo "Path: $PATH" >> $HAZEL_LOG_FILE

# Echo command for debbuging
# echo "" >> $HAZEL_LOG_FILE
# echo "$AUTOMATOR_SCRIPTS_PATH/aluguel-report.ts $1" >> $HAZEL_LOG_FILE
# echo "" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE

# Execute command
# $AUTOMATOR_SCRIPTS_PATH/hello-world.ts $1 >> $HAZEL_LOG_FILE 2>&1

echo "" >> $HAZEL_LOG_FILE

echo "Rule finished" >> $HAZEL_LOG_FILE
