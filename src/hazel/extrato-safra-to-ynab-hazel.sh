# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - AUTOMATOR_SCRIPTS_PATH
# - HAZEL_LOG_FILE
# - YNAB_ACCESS_TOKEN
# - BUDGET_EDU_2025
# - ACCOUNT_EDU_2025_SAFRA_CONTA_EDU

source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo "Rule [extrato-safra-csv-to-ynab] executed at: $(date)" >> $HAZEL_LOG_FILE
echo "Input file: $1" >> $HAZEL_LOG_FILE

# Echo command for debbuging
echo "" >> $HAZEL_LOG_FILE
echo "$AUTOMATOR_SCRIPTS_PATH/extrato-safra-csv-to-ynab-post.ts $1 $BUDGET_EDU_2025 $ACCOUNT_EDU_2025_SAFRA_CONTA_EDU $YNAB_ACCESS_TOKEN" >> $HAZEL_LOG_FILE
echo "" >> $HAZEL_LOG_FILE

# Execute command
$AUTOMATOR_SCRIPTS_PATH/extrato-safra-csv-to-ynab-post.ts $1 $BUDGET_EDU_2025 $ACCOUNT_EDU_2025_SAFRA_CONTA_EDU $YNAB_ACCESS_TOKEN >> $HAZEL_LOG_FILE 2>&1

echo "Rule finished" >> $HAZEL_LOG_FILE
