'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type Pet = {
  id: number
  name: string
  owner: string
  nicknames: string[]
  gender: 'male' | 'female'
  species: string
  birthday: string
  photo: string
}

const pets: Pet[] = [
  {
    id: 1,
    name: "Buddy",
    owner: "John Doe",
    nicknames: ["Bud", "Fluffy"],
    gender: "male",
    species: "Dog",
    birthday: "2018-05-15",
    photo: "/placeholder.svg?height=100&width=100"
  },
  {
    id: 2,
    name: "Whiskers",
    owner: "Jane Smith",
    nicknames: ["Kitty", "Princess"],
    gender: "female",
    species: "Cat",
    birthday: "2019-09-22",
    photo: "/placeholder.svg?height=100&width=100"
  },
  {
    id: 3,
    name: "Tweety",
    owner: "Alice Johnson",
    nicknames: ["Birdie", "Chirp"],
    gender: "male",
    species: "Bird",
    birthday: "2020-03-10",
    photo: "/placeholder.svg?height=100&width=100"
  },
  // Add more pets as needed
]

const getSpeciesColor = (species: string) => {
  const colors: { [key: string]: string } = {
    Dog: "bg-blue-500",
    Cat: "bg-green-500",
    Bird: "bg-yellow-500",
    Fish: "bg-purple-500",
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
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all')

  const filteredPets = selectedSpecies === 'all' 
    ? pets 
    : pets.filter(pet => pet.species.toLowerCase() === selectedSpecies.toLowerCase())

  const uniqueSpecies = Array.from(new Set(pets.map(pet => pet.species)))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Pet Directory</h1>
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
                  <p className="text-sm text-muted-foreground">Age {calculateAge(pet.birthday)}</p>
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
                  <p><strong>Owner:</strong> {pet.owner}</p>
                  <p><strong>Gender:</strong> {pet.gender}</p>
                  <p><strong>Birthday:</strong> {pet.birthday}</p>
                </div>
              </div>
              <div>
                <strong>Nicknames:</strong>
                <div className="flex flex-wrap gap-2 mt-1">
                  {pet.nicknames.map((nickname, index) => (
                    <Badge key={index} variant="outline">{nickname}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
