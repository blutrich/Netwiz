# NetWizBot

NetWizBot is a web application that helps WhatsApp communities connect members anonymously for mentorship, advice, and collaboration.

## Features

- **User Management**: Role-based access control with admin, manager, and viewer roles
- **Google Sheets Integration**: User data is synced with a Google Sheets document
- **Authentication System**: Secure login with role-based permissions
- **Dashboard**: Overview of community activity and metrics
- **Community Management**: Tools for managing community members
- **Request Handling**: System for handling anonymous requests
- **Analytics**: Insights into community engagement and activity

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Data Management**: Google Sheets API integration
- **Authentication**: Custom authentication system
- **Deployment**: Netlify or Vercel

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Sheets API key
- Netlify or Vercel CLI (for deployment)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/blutrich/Netwiz.git
   cd netwizbot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_EXPERT_SHEET_ID=your_google_sheet_id
   VITE_GOOGLE_API_KEY=your_google_api_key
   VITE_REQUEST_SHEET_ID=your_request_sheet_id
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Google Sheets Setup

1. Create a Google Sheet with an "admin" tab
2. Add the following columns:
   - Name (Column A)
   - Email (Column B)
   - Role (Column C) - values: admin, manager, or viewer
   - Status (Column D) - values: Active or Inactive
   - Last Login (Column E)

## Usage

### Authentication

- Users log in with their email address
- For simplicity, the password is the same as the email address
- Special admin access is provided for blutrich@gmail.com

### User Management

- Admins can add, edit, and deactivate users
- Changes to users in the application need to be manually synced to Google Sheets due to API limitations

## Deployment

### Netlify Deployment (Recommended)

1. Install Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```
   netlify login
   ```

3. Deploy using the deployment script:
   ```
   chmod +x deploy-netlify.sh
   ./deploy-netlify.sh
   ```

Alternatively, you can connect your GitHub repository to Netlify for automatic deployments:

1. Push your code to GitHub
2. Create a new site in Netlify and connect to your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables in the Netlify dashboard:
   - VITE_GOOGLE_API_KEY
   - VITE_EXPERT_SHEET_ID
   - VITE_REQUEST_SHEET_ID

Benefits of using Netlify:
- Automatic deployments when you push to GitHub
- Deploy previews for pull requests
- Built-in SSL/TLS certificates
- Easy environment variable management
- Global CDN for fast loading

### Vercel Deployment (Alternative)

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy using the deployment script:
   ```
   chmod +x deploy.sh
   ./deploy.sh
   ```

The deployment script performs the following actions:
- Validates environment variables
- Checks for uncommitted changes in Git
- Builds the project with production settings
- Deploys to Vercel with the correct environment variables

### Static Deployment (Testing Only)
For testing purposes, you can deploy just the static assets:
```
chmod +x deploy-static.sh
./deploy-static.sh
```

## Development Workflow

### Git Best Practices

1. **Branch Strategy**:
   - `main`: Production-ready code
   - `develop`: Integration branch for features
   - `feature/feature-name`: For new features
   - `bugfix/bug-name`: For bug fixes

2. **Commit Message Guidelines**:
   - Use clear, descriptive commit messages
   - Format: `[Type]: Brief description`
   - Types: feat, fix, docs, style, refactor, test, chore

3. **Pull Request Process**:
   - Create PRs from feature branches to develop
   - Request code reviews before merging
   - Squash commits when merging to keep history clean

### Environment Variables

- Never commit environment variables to Git
- Use `.env.example` to document required variables
- Set environment variables in deployment platforms

## Troubleshooting

### Common Issues

1. **App Not Loading After Deployment**:
   - Check if environment variables are set correctly in Netlify/Vercel
   - Ensure Google API key has proper permissions
   - Verify that the Google Sheets IDs are correct

2. **Google Sheets Connection Issues**:
   - Make sure the Google Sheets API is enabled in your Google Cloud Console
   - Check that your API key has access to the Google Sheets API
   - Verify CORS settings if accessing from browser

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- shadcn/ui for the component library
- Google Sheets API for data storage