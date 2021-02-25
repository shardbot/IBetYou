#!/bin/bash
set -e

if [ "$CIRCLE_BRANCH" == "develop" ]; then 
    TAG='latest'
    EXTERNAL_PORT=3001
    SENDGRID_API_KEY=$SENDGRID_API_KEY_LATEST
elif [ "$CIRCLE_BRANCH" == "main" ]; then
    TAG='stable' 
    EXTERNAL_PORT=3000
    SENDGRID_API_KEY=$SENDGRID_API_KEY_STABLE
else
    echo "Invalid branch detected. Check your .circleci/config.yml"
fi

ssh -o "StrictHostKeyChecking no" deploy@ec2-18-193-130-137.eu-central-1.compute.amazonaws.com "\
    mkdir -p $TAG && cd $TAG && curl https://raw.githubusercontent.com/Shard-Labs/IBetYou/${CIRCLE_BRANCH}/backend/docker-compose.yml > docker-compose.temp && \
    TAG=$TAG EXTERNAL_PORT=$EXTERNAL_PORT envsubst < "docker-compose.temp" > "docker-compose.yml" && rm docker-compose.temp && \
    echo "SENDGRID_API_KEY=$SENDGRID_API_KEY" > .env && \
    docker-compose pull && docker-compose up -d"
