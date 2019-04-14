#!/bin/bash

export MIX_ENV=prod
source ./.env
export PORT=4798

echo "Stopping old copy of app, if any..."

_build/prod/rel/news/bin/news stop || true

echo "Starting app..."


# Foreground for testing and for systemd
_build/prod/rel/news/bin/news foreground



