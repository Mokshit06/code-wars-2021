import { PageType, StoreUser } from '@prisma/client';
import { Router } from 'express';
import { match, pathToRegexp } from 'path-to-regexp';
import prisma from '../../../lib/prisma';

const PATH_TO_TYPE: Record<string, PageType> = {
  '/': PageType.HOME_PAGE,
  '/cart': PageType.CART_PAGE,
  '/products': PageType.PRODUCTS_LIST_PAGE,
  '/products/:id': PageType.SINGLE_PRODUCT_PAGE,
  '/login': PageType.LOGIN_PAGE,
  '/register': PageType.REGISTRATION_PAGE,
};

const router = Router();

router.get('/api/*', async (req, res) => {
  try {
    const { pageData } = await getPageData({
      domain: req.store!,
      path: `/${(req.params as any)['0']}`,
      storeUser: req.storeUser,
    });

    res.json(pageData);
  } catch {
    res.status(404).send();
  }
});

router.get('/*', async (req, res) => {
  try {
    const { pageData, page } = await getPageData({
      domain: req.store!,
      path: req.path,
      storeUser: req.storeUser,
    });
    const success = req.flash('success');
    const errors = req.flash('error');

    try {
      const template = eval(
        `require('handlebars').template(${page.compiledTemplate!})`
      );
      let html = template({
        ...pageData,
        message: {
          success,
          errors,
        },
      }) as string;
      html = html.replace('/* INJECT CSS */', page.css);
      html = html.replace(
        '// INJECT JAVASCRIPT',
        `
      window.pageData = (${JSON.stringify(pageData)});
      window.cart = {
        addToCart(product) {
          const cart = [...this.getCart(), product];
          localStorage.setItem('cart', JSON.stringify(cart))
        },
        getCart() {
          return JSON.parse(localStorage.getItem('cart')) || []
        },
        removeFromCart(productId) {
          const cart = this.getCart().filter(p => p.id !== productId);
          localStorage.setItem('cart', JSON.stringify(cart))
        }
      };
      ${page.compiledJs}
      `
      );

      res.send(html);
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  } catch (error) {
    if (error.message === 'redirect') {
      return res.redirect('/');
    }
    res.status(404).send();
  }
});

async function getPageData(data: {
  domain: string;
  path: string;
  storeUser?: StoreUser;
}) {
  const store = (await prisma.store.findUnique({
    where: { domain: data.domain },
    include: {
      pages: true,
      products: true,
    },
  }))!;
  const route = Object.entries(PATH_TO_TYPE).find(([path]) =>
    pathToRegexp(path).test(data.path)
  );

  if (!route) throw new Error();

  const [path, pageType] = route;
  const page = store.pages.find(p => p.type === pageType);

  if (
    (pageType === PageType.LOGIN_PAGE ||
      pageType === PageType.REGISTRATION_PAGE) &&
    data.storeUser
  ) {
    throw new Error('redirect');
  }

  if (!page) throw new Error();

  const matchPath = match(path, { decode: decodeURIComponent });
  const user = data.storeUser || {};

  delete (user as any).password;

  const pageData = {
    user: {
      ...user,
      isAuthenticated: !!data.storeUser,
    },
    name: store.name,
    domain: store.domain,
    products: store.products,
    product: null as any,
  };

  if (pageType === PageType.SINGLE_PRODUCT_PAGE) {
    const { params } = matchPath(data.path) as any;
    const id = params.id;
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new Error();

    pageData.product = product;
  }

  return { pageData, page };
}

export default router;
