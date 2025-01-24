# Replaced by:
# source /Users/eduardoportilho/dev/personal/automator/src/hazel/run_automator_script.sh $1 extrato-itau-to-ynab-post.ts BUDGET_CASAL ACCOUNT_ITAU_CASAL YNAB_ACCESS_TOKEN

# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - AUTOMATOR_SCRIPTS_PATH
# - HAZEL_LOG_FILE
# - YNAB_ACCESS_TOKEN
# - BUDGET_CASAL
# - ACCOUNT_ITAU_CASAL

source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo "Rule [extrato-itau-to-ynab] executed at: $(date)" >> $HAZEL_LOG_FILE
echo "Input file: $1" >> $HAZEL_LOG_FILE

# Echo command for debbuging
echo "" >> $HAZEL_LOG_FILE
echo "$AUTOMATOR_SCRIPTS_PATH/extrato-itau-to-ynab-post.ts $1 $BUDGET_CASAL $ACCOUNT_ITAU_CASAL $YNAB_ACCESS_TOKEN" >> $HAZEL_LOG_FILE
echo "" >> $HAZEL_LOG_FILE

# Execute command
$AUTOMATOR_SCRIPTS_PATH/extrato-itau-to-ynab-post.ts $1 $BUDGET_CASAL $ACCOUNT_ITAU_CASAL $YNAB_ACCESS_TOKEN >> $HAZEL_LOG_FILE 2>&1

echo "Rule finished" >> $HAZEL_LOG_FILE
