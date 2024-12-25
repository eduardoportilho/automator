#  Hazel rule : 
# - "Do the following to the matched file or folder:" / "Run shell script" / "embedded script" / "Edit script"
# - `source /Users/eduardoportilho/dev/personal/automator/src/hazel/ocr-pdf.sh`

# Required CLI tool:
# - OCRmyPDF: https://github.com/ocrmypdf/OCRmyPDF

# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - PDF_PASSWORD1="1111"
# - PDF_PASSWORD2="2222"
# - PDF_PASSWORD3="3333"
# - PDF_PASSWORD4="4444"
# - PDF_PASSWORD5="5555"

source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo "Rule [ocr-pdf] executed at: $(date)" >> $HAZEL_LOG_FILE
echo "Input file: $1" >> $HAZEL_LOG_FILE
echo "" >> $HAZEL_LOG_FILE

# `$1 $1` Add OCR to a file in place (only modifies file on success)
echo "ocrmypdf -l por $1 $1" >> $HAZEL_LOG_FILE
ocrmypdf -l por $1 $1

# Ignore error from ocrmypdf
exit 0;
