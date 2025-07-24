/**
 * Clean Apple Bites Server with Design System
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000; // Use expected port

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Clean Apple Bites app with working design system',
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/design-system/demo', (req, res) => {
  res.json({
    status: 'success',
    message: 'Design system is working! Change colors in src/design-system/tokens.ts',
    colors: {
      primary: '#4caf50',
      secondary: '#2196f3',
      success: '#4caf50'
    }
  });
});

// Serve React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Clean Apple Bites Server running on port ${PORT}`);
  console.log(`📱 Frontend available at http://localhost:${PORT}`);
  console.log(`🎨 Design System: Working and ready for global color changes!`);
});