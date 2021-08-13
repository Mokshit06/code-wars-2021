import { Router } from 'express';
import prisma from '../../../lib/prisma';
import { PageType, Product, Store } from '@prisma/client';
import { ensureAuthenticated } from '../middleware/auth';
import slugify from 'slugify';
import { promises as fs } from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import esbuild from 'esbuild';
import build from '../../../utils/build';

// replace `_` with `-`
slugify.extend({ _: '-' });

function slugifyDomain(name: string) {
  return slugify(name, {
    lower: true,
    replacement: '-',
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });
}

const router = Router();

router.get('/', ensureAuthenticated, async (req, res) => {
  if (!req.user) return;

  const stores = await prisma.store.findMany({
    where: { userId: req.user.id },
  });

  res.json(stores);
});

router.get('/:id', ensureAuthenticated, async (req, res) => {
  if (!req.user) return;

  const store = await prisma.store.findUnique({
    where: { id: req.params.id },
  });

  res.json(store);
});

router.get('/:id/products', ensureAuthenticated, async (req, res) => {
  if (!req.user) return;

  const products = await prisma.product.findMany({
    where: { storeId: req.params.id },
  });

  res.json(products);
});

router.post('/:id/products', ensureAuthenticated, async (req, res) => {
  if (!req.user) return;
  const data = req.body as Product;

  await prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      slug: slugify(data.name, { lower: true, strict: true }),
      availability: data.availability,
      description: data.description,
      sku: data.sku,
      storeId: req.params.id,
      images: data.images,
    },
  });

  res.json({
    message: 'Product created',
  });
});

router.get('/:id/customers', ensureAuthenticated, async (req, res) => {
  if (!req.user) return;

  const customers = await prisma.storeUser.findMany({
    where: { storeId: req.params.id },
  });

  res.json(customers);
});

router.get('/:id/pages', ensureAuthenticated, async (req, res) => {
  if (!req.user) return;

  const pages = await prisma.page.findMany({
    where: { storeId: req.params.id },
  });

  res.json(pages);
});

const THEMES_FOLDER = path.join(process.cwd(), 'src', 'themes');

router.post('/:id/pages', ensureAuthenticated, async (req, res) => {
  const themes = await fs.readdir(THEMES_FOLDER);
  const theme = req.body.theme as string;
  const pageType = req.body.pageType as PageType;

  if (!themes.includes(theme)) {
    return res.status(400).json({
      message: "Theme doesn't exist",
    });
  }

  if (!Object.keys(PageType).includes(pageType)) {
    return res.status(400).json({
      message: 'Invalid page type',
    });
  }

  const [template, css, js] = await Promise.all([
    fs.readFile(
      path.join(THEMES_FOLDER, theme, pageType, 'template.hbs'),
      'utf8'
    ),
    fs.readFile(path.join(THEMES_FOLDER, theme, pageType, 'style.css'), 'utf8'),
    fs.readFile(path.join(THEMES_FOLDER, theme, pageType, 'script.js'), 'utf8'),
  ]);

  const compiledTemplate = Handlebars.precompile(template) as string;
  const compiledJs = await build(js);

  const page = await prisma.page.create({
    data: {
      css,
      rawJs: js,
      rawTemplate: template,
      compiledTemplate,
      compiledJs,
      storeId: req.params.id,
      type: req.body.pageType as PageType,
    },
  });

  res.status(201).json({
    message: 'Page created',
  });
});

router.post('/', ensureAuthenticated, async (req, res) => {
  if (!req.user) return;

  const data = req.body as Store;
  await prisma.store.create({
    data: {
      name: data.name,
      address: data.address,
      apartment: data.apartment,
      city: data.city,
      country: data.country,
      phoneNumber: data.phoneNumber,
      pinCode: data.pinCode,
      state: data.state,
      website: data.website,
      domain: slugifyDomain(data.name),
      userId: req.user.id,
    },
  });

  res.status(201).send({
    message: 'Store created',
  });
});

export default router;
