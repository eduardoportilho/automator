# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - AUTOMATOR_SCRIPTS_PATH
# - HAZEL_LOG_FILE

source /Users/eduardoportilho/dev/personal/automator/src/keyboard-maestro/env.sh
source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo ""hello-world.sh" Shell Script action executed at: $(date)" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE

echo "Path: $PATH" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE

CLIPBOARD=`pbpaste`
echo "Clipboard content: [$CLIPBOARD]" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE
# KMVAR_Path contains the path of the selected file in finder (https://wiki.keyboardmaestro.com/collection/Finders_Selection)
# Obs: "Path" is set in KM UI
echo "Path from KM: [$KMVAR_Path]" >> $HAZEL_LOG_FILE

# Is -ld "$KMVAR_Path"

# Echo command for debbuging
# echo "" >> $HAZEL_LOG_FILE
# echo "$AUTOMATOR_SCRIPTS_PATH/aluguel-report.ts $1" >> $HAZEL_LOG_FILE

echo "" >> $HAZEL_LOG_FILE

# Execute command
$AUTOMATOR_SCRIPTS_PATH/hello-world.ts "$CLIPBOARD" >> $HAZEL_LOG_FILE 2>&1

echo "" >> $HAZEL_LOG_FILE

echo "Rule finished" >> $HAZEL_LOG_FILE
