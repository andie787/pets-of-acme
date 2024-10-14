'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type Pet = {
  id: number
  name: string
  owner: string
  gender: 'male' | 'female'
  species: string
  birthday: string
  age?: number; // Calculated field
  photo: string
}

const getSpeciesColor = (species: string) => {
  const colors: { [key: string]: string } = {
    dog: "bg-blue-500",
    cat: "bg-green-500",
    bird: "bg-yellow-500",
    fish: "bg-purple-500",
    rodent: "bg-orange-500",
    // Add more species and colors as needed
  }
  return colors[species] || "bg-gray-500"
}

const calculateAge = (birthday: string) => {
  const birthDate = new Date(birthday)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

export default function Component() {
  const [pets, setPets] = useState<Pet[]>([])
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all')

  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await fetch('/api/')
        const data = await res.json()
        setPets(data)
      } catch (error) {
        console.error('Error fetching pets:', error)
      }
    }

    fetchPets()
  }, [])

  const filteredPets = selectedSpecies === 'all' 
    ? pets 
    : pets.filter(pet => pet.species.toLowerCase() === selectedSpecies.toLowerCase())

  const uniqueSpecies = Array.from(new Set(pets.map(pet => pet.species)))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Pets of Acme</h1>

      <div className="mb-4">
        <Link href="/add-pets">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Add a New Pet
          </button>
        </Link>
      </div>

      <div className="mb-4">
        <Select onValueChange={setSelectedSpecies} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by species" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Species</SelectItem>
            {uniqueSpecies.map((species) => (
              <SelectItem key={species} value={species.toLowerCase()}>{species}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPets.map((pet) => (
          <Card key={pet.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div>
                  <span>{pet.name}</span>
                  <p className="text-sm text-muted-foreground">Age {pet.age}</p>
                </div>
                <Badge className={`${getSpeciesColor(pet.species)} text-white`}>
                  {pet.species}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={pet.photo} alt={pet.name} />
                  <AvatarFallback>{pet.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p><strong>Gender:</strong> {pet.gender}</p>
                  <p><strong>Birthday:</strong> {pet.birthday}</p>
                  <p><strong>Human guardian:</strong> {pet.owner}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
