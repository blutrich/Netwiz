# NetWizBot - WhatsApp Anonymous Request System

A management dashboard for an AI-powered anonymous request system for WhatsApp communities. This system allows community members to send anonymous requests and connects them with relevant community members automatically.

## Features

- **Dashboard**: Overview of system performance and recent activity
- **Community Management**: Manage community members and their expertise areas
- **Request Handling**: View, filter, and manage anonymous requests
- **Analytics**: Track performance metrics and insights
- **Settings**: Configure WhatsApp integration, OpenAI, and system behavior

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend Integration**: WhatsApp Business API (Green API), Make (Integromat)
- **AI Processing**: OpenAI GPT-4 API
- **Database**: Airtable / Google Sheets

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/netwizbot.git
cd netwizbot
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## System Architecture

The NetWizBot system consists of several components:

1. **WhatsApp Integration**: Uses Green API to connect to WhatsApp
2. **Automation Engine**: Make (Integromat) handles the workflow automation
3. **AI Analysis**: OpenAI GPT-4 analyzes and categorizes requests
4. **Database**: Stores community members and their expertise
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