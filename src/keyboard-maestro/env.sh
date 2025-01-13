export PATH=$PATH:/opt/homebrew/bin:/opt/homebrew/sbin:/System/Cryptexes/App/usr/bin:/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin
# Suppress deprecation warnings like "(node:21673) [DEP0040] DeprecationWarning: The `punycode` module is deprecated.""
# @see https://stackoverflow.com/questions/77587325/deprecationwarning-the-punycode-module-is-deprecated
export NODE_OPTIONS="--no-deprecation"