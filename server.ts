import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const LIVE_BACKEND_URL = (
  process.env.VITE_API_BASE_URL ||
  process.env.VITE_BACKEND_URL ||
  process.env.BACKEND_URL ||
  'http://127.0.0.1:8000'
).replace(/\/$/, '');

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Proxy all /api/* requests directly to the live FastAPI + PostgreSQL backend
  app.use('/api', async (req, res) => {
    const targetUrl = `${LIVE_BACKEND_URL}/api${req.url}`;
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (req.headers['content-type']) {
        headers['Content-Type'] = String(req.headers['content-type']);
      }
      if (req.headers['authorization']) {
        headers['Authorization'] = String(req.headers['authorization']);
      }

      const fetchOptions: RequestInit = {
        method: req.method,
        headers,
      };

      if (!['GET', 'HEAD'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
        if (headers['Content-Type']?.includes('application/x-www-form-urlencoded')) {
          fetchOptions.body = new URLSearchParams(req.body).toString();
        } else {
          fetchOptions.body = JSON.stringify(req.body);
        }
      }

      const upstreamRes = await fetch(targetUrl, fetchOptions);
      const contentType = upstreamRes.headers.get('content-type') || '';

      res.status(upstreamRes.status);
      if (contentType.includes('application/json')) {
        const data = await upstreamRes.json();
        return res.json(data);
      } else {
        const text = await upstreamRes.text();
        return res.send(text);
      }
    } catch (err: any) {
      console.error(`[API Proxy Error] ${req.method} ${targetUrl}:`, err.message);
      return res.status(502).json({
        detail: 'Unable to reach live SkulBuy backend server',
        error: err.message,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 SkulBuy Frontend Server running at http://localhost:${PORT}`);
    console.log(`🔗 Proxying /api/* -> ${LIVE_BACKEND_URL}/api/*\n`);
  });
}

startServer();
