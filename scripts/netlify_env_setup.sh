#!/bin/bash

if [ "$BRANCH" = "main" ]; then
    CONTRACT_ADDRESS=${CA_PROD}
    API_URL=${API_URL_PROD}
elif [ "$BRANCH" = "develop" ]; then
    CONTRACT_ADDRESS=${CA_DEVELOP}
    API_URL=${API_URL_DEVELOP}
fi

echo "NEXT_PUBLIC_API_URL=${API_URL}" > .env
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}" >> .env
