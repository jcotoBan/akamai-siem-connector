#!/bin/bash

# Define the prompt.
echo "export CLICOLOR=1" > ~/.bashrc
echo "export PS1='[\u@\h:\W]$ '" >> ~/.bashrc

for file in $ETC_DIR/nginx/http.d/*.conf; do
  basename="/tmp/$(basename -- $file)"

  cp "$file" $basename
  sed -i -e 's|${QUEUE_DOMAIN}|'"$QUEUE_DOMAIN"'|g' $basename
  sed -i -e 's|${DASHBOARDS_DOMAIN}|'"$DASHBOARDS_DOMAIN"'|g' $basename
  cp -f $basename "/etc/nginx/http.d/$(basename -- $file)"
  rm $basename
done