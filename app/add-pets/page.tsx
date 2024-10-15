'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { CustomDatePicker } from "@/components/ui/custom-date-picker"

export default function AddPet() {
  const [formData, setFormData] = useState({
    owner: '',
    name: '',
    nicknames: '',
    species: '',
    gender: '',
    birthday: null as Date | null,
    bio: '',
    photoUrl: ''
  })

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleDateChange = (date: Date) => {
    setFormData(prevState => ({ ...prevState, birthday: date }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          nicknames: formData.nicknames.split(',').map(nickname => nickname.trim()),
          birthday: formData.birthday ? formData.birthday.toISOString().split('T')[0] : null
        }),
        })

      if (res.ok) {
        router.push('/')
      } else {
        console.error('Failed to add pet')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

/** const handleCancel = () => {
    router.push('/')
  } */

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Add your pet</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="owner">Your name</Label>
              <Input
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Pet's name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nicknames">Nicknames (comma-separated)</Label>
              <Input
                id="nicknames"
                name="nicknames"
                value={formData.nicknames}
                onChange={handleInputChange}
                placeholder="Fluffy, Mr. Whiskers, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="species">Type</Label>
              <Select name="species" onValueChange={(value) => handleSelectChange('species', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select the type of pet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bird">Bird</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="rodent">Rodent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender" onValueChange={(value) => handleSelectChange('gender', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <CustomDatePicker
                selectedDate={formData.birthday}
                onDateChange={handleDateChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (500 characters max)</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                maxLength={500}
                className="h-32"
                placeholder="Tell us about your pet..."
              />
              <div className="text-sm text-muted-foreground text-right">
                {formData.bio.length}/500 characters
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL</Label>
              <Input
                id="photoUrl"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-violet-800 hover:bg-violet-600 text-white">Add pet</Button>
              <Link href="/">
                <Button type="button" variant="outline" className="w-full">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
