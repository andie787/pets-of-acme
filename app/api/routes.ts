import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const pets = await prisma.pet.findMany();
  return NextResponse.json(pets);
}
