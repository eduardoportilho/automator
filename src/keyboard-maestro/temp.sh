#!/bin/zsh

ENV_1="Hello world"
ENV_2="Foo Bar"
# ENV_TO_ARGS="ENV_1 ENV_2"
ENV_TO_ARGS_ARRAY=()

if [ -n $ENV_TO_ARGS ]; then;
  echo "\$ENV_TO_ARGS is not empty"

  ENV_TO_ARGS_ARRAY=(${(s< >)ENV_TO_ARGS})

  for i in $ENV_TO_ARGS_ARRAY; do
    echo Item: $i
    echo "Value: ${(P)i}"
  done
fi


echo "will call temp2.sh"
./src/keyboard-maestro/temp2.sh $ENV_TO_ARGS_ARRAY
