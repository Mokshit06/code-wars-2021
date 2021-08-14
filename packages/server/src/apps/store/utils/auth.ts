import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { Request } from 'express';

export async function login(data: {
  email: string;
  password: string;
  domain: string;
}) {
  const store = await prisma.store.findUnique({
    where: { domain: data.domain },
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
    throw new Error("Account doesn't exist");
  }

  const passwordIsCorrrect = await bcrypt.compare(data.password, user.password);
  if (!passwordIsCorrrect) {
    throw new Error('Username or password is incorrect');
  }

  return user;
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  domain: string;
}) {
  const store = await prisma.store.findUnique({
    where: { domain: data.domain },
  });
  const existingUser = await prisma.storeUser.findUnique({
    where: {
      email_storeId: {
        email: data.email,
        storeId: store!.id,
      },
    },
  });

  if (existingUser) {
    throw new Error('Account already exists');
  }

  const user = await prisma.storeUser.create({
    data: {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, 8),
      storeId: store!.id,
    },
  });

  return user;
}
