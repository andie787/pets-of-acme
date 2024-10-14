import { NextResponse } from 'next/server';
import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

interface PetRequestBody {
    owner: string;
    name: string;
    species: string;
    gender: Gender;
    birthday: Date;
    photoUrl: string;
  }

  export async function POST(req: Request): Promise<NextResponse> {
    try {
      const { owner, name, species, gender, birthday, photoUrl }: PetRequestBody = await req.json();
  
      // Convert the birthday string to a Date object before passing to Prisma
      const newPet = await prisma.pet.create({
        data: {
          owner,
          name,
          species,
          gender,
          birthday: new Date(birthday), // Convert birthday string to Date object
          photoUrl,
        },
      });
  
      return NextResponse.json(newPet);
    } catch (error) {
      console.error('Error creating a new pet:', error);
      // Return a proper response with status 500 for errors
      return NextResponse.json({ error: 'Failed to create new pet' }, { status: 500 });
    }
  }

  export async function GET(): Promise<NextResponse> {
    try {
      const pets = await prisma.pet.findMany();
  
      // Calculate age dynamically for each pet
      const petsWithAge = pets.map(pet => ({
        ...pet,
        age: new Date().getFullYear() - pet.birthday.getFullYear(),
      }));
  
      return NextResponse.json(petsWithAge);
    } catch (error) {
      console.error('Error fetching pets:', error);
      return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 });
    }
  }
