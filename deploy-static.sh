#!/bin/bash

# Deploy public directory to Vercel
echo "Deploying public directory to Vercel..."
vercel deploy --prod --public ./public 