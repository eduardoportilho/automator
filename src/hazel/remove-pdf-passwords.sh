#  Hazel rule : 
# - "Do the following to the matched file or folder:" / "Run shell script" / "embedded script" / "Edit script"
# - `source /Users/eduardoportilho/dev/personal/automator/src/hazel/remove-pdf-passwords.sh`

# Required CLI tool:
# - qpdf: https://github.com/qpdf/qpdf (brew install qpdf)

# Required environment variables:
# - $1 (Input file path provided by Hazel)
# - PDF_PASSWORD1="1111"
# - PDF_PASSWORD2="2222"
# - PDF_PASSWORD3="3333"
# - PDF_PASSWORD4="4444"
# - PDF_PASSWORD5="5555"

source /Users/eduardoportilho/dev/personal/automator/.envrc
echo "----------------------------------------------" > $HAZEL_LOG_FILE
echo "Rule [remove-pdf-passwords] executed at: $(date)" >> $HAZEL_LOG_FILE
echo "Input file: $1" >> $HAZEL_LOG_FILE
echo "" >> $HAZEL_LOG_FILE

# Não consegui fazer o split de uma string com todos as senha e fazer um loop sobre o resultado, então foi um por um mesmo...

# Echo command for debbuging
echo "qpdf --decrypt --password=$PDF_PASSWORD1 --replace-input $1" >> $HAZEL_LOG_FILE
qpdf --decrypt --password=$PDF_PASSWORD1 --replace-input $1

# Echo command for debbuging
echo "qpdf --decrypt --password=$PDF_PASSWORD2 --replace-input $1" >> $HAZEL_LOG_FILE
qpdf --decrypt --password=$PDF_PASSWORD2 --replace-input $1

# Echo command for debbuging
echo "qpdf --decrypt --password=$PDF_PASSWORD3 --replace-input $1" >> $HAZEL_LOG_FILE
qpdf --decrypt --password=$PDF_PASSWORD3 --replace-input $1

# Echo command for debbuging
echo "qpdf --decrypt --password=$PDF_PASSWORD4 --replace-input $1" >> $HAZEL_LOG_FILE
qpdf --decrypt --password=$PDF_PASSWORD4 --replace-input $1

# Echo command for debbuging
echo "qpdf --decrypt --password=$PDF_PASSWORD5 --replace-input $1" >> $HAZEL_LOG_FILE
qpdf --decrypt --password=$PDF_PASSWORD5 --replace-input $1

# Echo command for debbuging
echo "qpdf --decrypt --password=$PDF_PASSWORD6 --replace-input $1" >> $HAZEL_LOG_FILE
qpdf --decrypt --password=$PDF_PASSWORD6 --replace-input $1

# Ignore error from qpdf
exit 0;
