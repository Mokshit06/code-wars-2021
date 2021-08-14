import flash from 'connect-flash';
import express from 'express';
import prisma from '../../lib/prisma';
import router from './routes';

const app = express();

app.use(flash());

app.use(async (req, res, next) => {
  const store = await prisma.store.findUnique({
    where: { domain: req.store },
    include: {
      pages: true,
      products: true,
    },
  });

  if (!store) {
    return res.status(404).send();
  }

  next();
});

app.use(async (req, res, next) => {
  const auth = (req.session as any).auth;
  if (!auth) return next();

  const userId = auth.user;
  if (!userId) return next();

  const user = await prisma.storeUser.findUnique({
    where: { id: userId },
  });
  if (!user) return next();

  req.storeUser = user;

  next();
});

app.use('/', router);

export default app;
