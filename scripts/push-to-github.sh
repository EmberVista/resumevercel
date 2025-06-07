#!/bin/bash

# Script to push to GitHub with authentication
# Usage: ./scripts/push-to-github.sh YOUR_GITHUB_USERNAME YOUR_GITHUB_TOKEN

if [ $# -lt 2 ]; then
    echo "Usage: $0 <github-username> <github-token>"
    echo "Get token from: GitHub → Settings → Developer settings → Personal access tokens"
    exit 1
fi

GITHUB_USERNAME=$1
GITHUB_TOKEN=$2

echo "Pushing to GitHub..."
git push https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/EmberVista/resumevercel.git main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "Next steps:"
    echo "1. Go to https://vercel.com"
    echo "2. Import your repository: https://github.com/EmberVista/resumevercel"
    echo "3. Follow the deployment guide in DEPLOYMENT_GUIDE.md"
else
    echo "❌ Push failed. Please check your credentials."
fi