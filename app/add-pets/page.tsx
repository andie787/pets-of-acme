'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddPet() {
  const [formData, setFormData] = useState({
    owner: '',
    name: '',
    species: '',
    gender: 'male',
    birthday: '',
    photoUrl: ''
  })

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prevState => ({ ...prevState, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Add a New Pet</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Owner</label>
          <input
            name="owner"
            value={formData.owner}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
        <div>
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
        <div>
          <label>Type</label>
          <select
            name="species"
            value={formData.species}
            onChange={handleInputChange}
            className="select"
            required
          >
            <option value="bird">Bird</option>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="fish">Fish</option>
            <option value="rodent">Rodent</option>
            </select>
        </div>
        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="select"
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Birthday</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
        <div>
          <label>Photo URL</label>
          <input
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleInputChange}
            className="input"
            required
          />
        </div>
        <button type="submit" className="button">Add Pet</button>
      </form>
    </div>
  )
}
