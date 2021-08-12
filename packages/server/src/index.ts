import express from 'express';
import store from './apps/store';
import platform from './apps/platform';

declare global {
  namespace Express {
    export interface Request {
      store?: string;
    }
  }
}

const app = express();

app.use((req, res) => {
  const { subdomains } = req;

  if (subdomains.length > 1) {
    return res.status(404).send();
  }

  if (subdomains.length === 1) {
    req.store = subdomains[0];
    return store(req, res);
  }

  return platform(req, res);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
