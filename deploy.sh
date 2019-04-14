#!/bin/bash

export MIX_ENV=prod
export PORT=4798
source ./.env
export NODEBIN=`pwd`/assets/node_modules/.bin
export PATH="$PATH:$NODEBIN"

mix deps.get
mix compile
(cd assets && npm install)
(cd assets && webpack --mode production)
mix phx.digest
mix release
echo "Starting app..."

_build/prod/rel/news/bin/news foreground

