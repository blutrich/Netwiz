# NetWizBot - WhatsApp Anonymous Request System

A management dashboard for an AI-powered anonymous request system for WhatsApp communities. This system allows community members to send anonymous requests and connects them with relevant community members automatically.

## Features

- **Dashboard**: Overview of system performance and recent activity
- **Community Management**: Manage community members and their expertise areas
- **Request Handling**: View, filter, and manage anonymous requests
- **Analytics**: Track performance metrics and insights with interactive charts
- **Settings**: Configure WhatsApp integration, OpenAI, and system behavior

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui, Recharts
- **Data Visualization**: Recharts for interactive analytics
- **Data Source**: Google Sheets API
- **Backend Integration**: WhatsApp Business API (Green API), Make (Integromat)
- **AI Processing**: OpenAI GPT-4 API

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Google Sheets API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/blutrich/Netwiz.git
cd Netwiz
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_EXPERT_SHEET_ID=your_expert_sheet_id
VITE_REQUEST_SHEET_ID=your_request_sheet_id
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment to Vercel

### Option 1: Deploy from GitHub

1. Push your code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Go to [Vercel](https://vercel.com) and sign in with your GitHub account
3. Click "Add New Project" and select your repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_GOOGLE_API_KEY`: Your Google API key
   - `VITE_EXPERT_SHEET_ID`: Your expert sheet ID
   - `VITE_REQUEST_SHEET_ID`: Your request sheet ID
6. Click "Deploy"

### Option 2: Deploy with Vercel CLI

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Login to Vercel
```bash
vercel login
```

3. Deploy the project
```bash
vercel
```

4. Follow the prompts to configure your project

## System Architecture

The NetWizBot system consists of several components:

1. **WhatsApp Integration**: Uses Green API to connect to WhatsApp
2. **Automation Engine**: Make (Integromat) handles the workflow automation
3. **AI Analysis**: OpenAI GPT-4 analyzes and categorizes requests
4. **Database**: Google Sheets stores community members and their expertise
5. **Admin Dashboard**: This React application for monitoring and configuration

## Workflow

1. User sends an anonymous request to the WhatsApp bot
2. The system analyzes the request using AI
3. Relevant community members are identified based on expertise
4. The system facilitates anonymous connections between users
5. Admins can monitor and manage the entire process through this dashboard

## License

MIT

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build system
- [React](https://reactjs.org/) for the UI library
- [Recharts](https://recharts.org/) for data visualization 