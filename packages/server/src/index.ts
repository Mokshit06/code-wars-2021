import 'dotenv-flow/config';
import express from 'express';
import store from './apps/store';
import api from './apps/api';
import cors from 'cors';
import pgSession from 'connect-pg-simple';
import expressSession from 'express-session';
import { StoreUser, User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    export interface Request {
      store?: string;
      storeUser?: StoreUser;
    }

    export interface User extends PrismaUser {}
  }
}

const app = express();

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PgStore = pgSession(expressSession);
const sessionMiddleware = expressSession({
  secret: process.env.COOKIE_SECRET!,
  resave: false,
  saveUninitialized: false,
  store: new PgStore(),
});

app.use(sessionMiddleware);

app.use((req, res) => {
  const { subdomains } = req;

  if (process.env.NODE_ENV === 'development') {
    // api.lvh.me:5000
    // subdomains: ['api']
    if (subdomains.length > 1) {
      return res.status(404).send();
    }
  } else {
    // api.app.mokshitjain.co
    // subdomains: ['api', 'app']
    if (subdomains.length > 2) {
      return res.status(404).send();
    }
  }

  const [subdomain] = subdomains;

  if (!subdomain) {
    return res.status(404).send();
  }

  if (subdomain === 'api') {
    return api(req, res);
  }

  req.store = subdomain;
  return store(req, res);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
