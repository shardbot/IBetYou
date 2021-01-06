#!/bin/bash
set -e

export TAG="$CIRCLE_BRANCH"

if [ "$CIRCLE_BRANCH" = "main" ]; then
    export TAG="stable"; 
elif [ "$CIRCLE_BRANCH" = "develop" ]; then
    export TAG="latest";
fi

docker login --username $DOCKER_USER --password $DOCKER_PASS
docker build -f backend/Dockerfile -t shardlabs/ibetyou:$TAG backend/
docker push shardlabs/ibetyou:$TAG
