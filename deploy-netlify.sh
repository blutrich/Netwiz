#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create .env file with required environment variables."
  exit 1
fi

# Validate required environment variables
if [ -z "$VITE_GOOGLE_API_KEY" ] || [ -z "$VITE_EXPERT_SHEET_ID" ] || [ -z "$VITE_REQUEST_SHEET_ID" ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
fi

# Validate again after loading
if [ -z "$VITE_GOOGLE_API_KEY" ] || [ -z "$VITE_EXPERT_SHEET_ID" ] || [ -z "$VITE_REQUEST_SHEET_ID" ]; then
  echo "Error: Required environment variables are missing. Please check your .env file."
  echo "Required variables: VITE_GOOGLE_API_KEY, VITE_EXPERT_SHEET_ID, VITE_REQUEST_SHEET_ID"
  exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "Warning: You have uncommitted changes. Please commit or stash them before deploying."
  git status
  read -p "Do you want to continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment aborted."
    exit 1
  fi
fi

# Prepare for deployment
echo "Preparing for deployment..."
npm run prepare-deploy || { echo "Preparation failed"; exit 1; }

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
  echo "Netlify CLI not found. Installing..."
  npm install -g netlify-cli
fi

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

echo "Deployment completed successfully!" 