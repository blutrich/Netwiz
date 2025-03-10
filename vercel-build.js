// Custom build script for Vercel
const { execSync } = require('child_process');

console.log('Starting custom build script...');

try {
  // Skip TypeScript checking and run Vite build directly
  console.log('Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 