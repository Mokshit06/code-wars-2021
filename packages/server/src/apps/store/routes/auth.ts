import { Router } from 'express';
import { login, register } from '../utils/auth';

const router = Router();

router.post('/api/login', async (req, res) => {
  try {
    const user = await login({
      email: req.body.email,
      password: req.body.password,
      domain: req.store!,
    });

    (req.session as any).auth ||= {};
    (req.session as any).auth.user = user.id;
    req.storeUser = user;

    res.json({ message: 'Logged in successfully!' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.post('/api/register', async (req, res) => {
  try {
    const user = await register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      domain: req.store!,
    });

    (req.session as any).auth ||= {};
    (req.session as any).auth.user = user.id;
    req.storeUser = user;

    res.json({ message: 'Registered successfully!' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await login({
      email: req.body.email,
      password: req.body.password,
      domain: req.store!,
    });

    (req.session as any).auth ||= {};
    (req.session as any).auth.user = user.id;
    req.storeUser = user;

    req.flash('success', 'Logged in successfully!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/login');
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      domain: req.store!,
    });

    (req.session as any).auth ||= {};
    (req.session as any).auth.user = user.id;
    req.storeUser = user;

    req.flash('success', 'Registered successfully!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
});

export default router;
