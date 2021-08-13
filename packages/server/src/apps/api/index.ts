import { SocialProvider, User } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from '../../lib/prisma';
import routes from './routes';
const app = express();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const userProfile = await prisma.user.upsert({
          where: {
            socialId: profile.id,
          },
          create: {
            name: profile.displayName,
            socialId: profile.id,
            provider: SocialProvider.GOOGLE,
            email: profile.emails?.[0].value,
            image: profile.photos?.[0].value,
          },
          update: {
            name: profile.displayName,
            image: profile.photos?.[0].value,
          },
        });

        done(null, userProfile);
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, (user as User).id));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/', async (req, res) => {
  res.send('api');
});

app.use('/', routes);
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  console.error(err);

  res.status(500).json({ success: false, message: err.message });
});

export default app;

// next -> lvh.me:3000
// server -> api.lvh.me:5000
// store -> store.lvh.me:6000
// store api -> api.store.lvh.me:6000
