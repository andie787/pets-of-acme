import { NextResponse } from 'next/server';
import { PrismaClient, Gender, Species } from '@prisma/client';

const prisma = new PrismaClient();

interface PetRequestBody {
    owner: string;
    name: string;
    nicknames: string[],
    species: Species;
    gender: Gender;
    birthday: Date;
    bio: string
    photoUrl: string;
}

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { owner, name, nicknames, species, gender, birthday, bio, photoUrl }: PetRequestBody = await req.json();
    
        const newPet = await prisma.pet.create({
            data: {
                owner,
                name,
                nicknames,
                species,
                gender,
                birthday: new Date(birthday), // Convert birthday string to Date object
                bio,
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
            age: calculatePetAge(pet.birthday),
        }));
    
        return NextResponse.json(petsWithAge);
    } catch (error) {
        console.error('Error fetching pets:', error);
        return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 });
    }
}

// Function to calculate the pet's age, returning months if under a year
function calculatePetAge(birthday: Date): string {
  const birthDate = new Date(birthday);
  const today = new Date();

  // Calculate year, month, and day differences
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // If days difference is negative, adjust the month count
  if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); // Get days in previous month
  }

  // If months difference is negative, adjust the year count
  if (months < 0) {
      years -= 1;
      months += 12;
  }

  // If less than one year, return the age in months
  if (years === 0) {
      return `${months} month${months === 1 ? '' : 's'}`;
  }

  // Otherwise, return the age in years
  return `${years} year${years === 1 ? '' : 's'}`;
}
