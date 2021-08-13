import { PageType } from '@prisma/client';
import express from 'express';
import prisma from '../../lib/prisma';

const app = express();

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

  // TODO change to find page from path regedx
  const page = store.pages.find(p => p.type === PageType.HOME_PAGE);

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
