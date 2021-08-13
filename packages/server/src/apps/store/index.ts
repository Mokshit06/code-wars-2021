import { PageType, StoreUser } from '@prisma/client';
import express from 'express';
import prisma from '../../lib/prisma';
import { pathToRegexp, match } from 'path-to-regexp';
import bcrypt from 'bcrypt';

const app = express();

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

app.get('/api', async (req, res) => {
  res.json({ session: req.session, storeUser: req.user });
});

app.post('/api/login', async (req, res) => {
  const data = req.body as { email: string; password: string };
  const store = await prisma.store.findUnique({
    where: { domain: req.store },
  });
  const user = await prisma.storeUser.findUnique({
    where: {
      email_storeId: {
        email: data.email,
        storeId: store!.id,
      },
    },
  });

  if (!user) {
    return res.status(400).send("Account doesn't exist");
  }

  const passwordIsCorrrect = await bcrypt.compare(data.password, user.password);
  if (!passwordIsCorrrect) {
    return res.status(400).send('Username or password is incorrect');
  }

  (req.session as any).auth ||= {};
  (req.session as any).auth.user = user.id;
  req.storeUser = user;

  res.json({
    message: 'Logged in',
  });
});

app.post('/api/register', async (req, res) => {
  const data = req.body as StoreUser;
  const store = await prisma.store.findUnique({
    where: { domain: req.store },
  });

  await prisma.storeUser.create({
    data: {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, 8),
      storeId: store!.id,
    },
  });

  res.json({
    message: 'Registration successful',
  });
});

const PATH_TO_TYPE: Record<string, PageType> = {
  '/': PageType.HOME_PAGE,
  '/cart': PageType.CART_PAGE,
  '/products': PageType.PRODUCTS_LIST_PAGE,
  '/products/:id': PageType.SINGLE_PRODUCT_PAGE,
};

app.get('/*', async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { domain: req.store },
    include: {
      pages: true,
      customers: true,
      owner: true,
      products: true,
    },
  });
  if (!store) {
    return res.status(404).send();
  }

  const route = Object.entries(PATH_TO_TYPE).find(([path]) =>
    pathToRegexp(path).test(req.path)
  );
  if (!route) return res.status(404).send();

  const [, pageType] = route;
  const page = store.pages.find(p => p.type === pageType);

  let pageData = {
    user: {
      isAuthenticated: req.isAuthenticated(),
    },
  };

  if (!page) {
    return res.status(404).send();
  }

  try {
    const template = eval(
      `require('handlebars').template(${page.compiledTemplate!})`
    );
    let html = template(store) as string;
    html = html.replace('<!-- INJECT CSS -->', page.css);
    html = html.replace('// INJECT JAVASCRIPT', page.compiledJs!);

    res.send(html);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

export default app;
