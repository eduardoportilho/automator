# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - AUTOMATOR_SCRIPTS_PATH
# - HAZEL_LOG_FILE

source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo "Rule [carteira-xp-to-sheets] executed at: $(date)" >> $HAZEL_LOG_FILE
echo "Input file: $1" >> $HAZEL_LOG_FILE

# Echo command for debbuging
echo "" >> $HAZEL_LOG_FILE
echo "$AUTOMATOR_SCRIPTS_PATH/carteira-xp-to-sheets.ts $1" >> $HAZEL_LOG_FILE
echo "" >> $HAZEL_LOG_FILE

# Execute command
$AUTOMATOR_SCRIPTS_PATH/carteira-xp-to-sheets.ts $1 >> $HAZEL_LOG_FILE 2>&1

echo "Rule finished" >> $HAZEL_LOG_FILE
