import { useState } from 'react';

export default function NewPetProfile() {
  const [formData, setFormData] = useState({
    owner: '',
    name: '',
    species: '',
    birthday: '',
    photoUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Pet profile submitted!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>

      <label>Your name: </label>
      <input type="text" name="owner" value={formData.owner} onChange={handleChange} required />

      <label>Pet's name: </label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      
      <label>Species: </label>
      <input type="text" name="species" value={formData.species} onChange={handleChange} required />
      
      <label>Birthday: </label>
      <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} required />
      
      <label>Photo URL: </label>
      <input type="text" name="photoUrl" value={formData.photoUrl} onChange={handleChange} required />
      
      <button type="submit">Submit</button>
    </form>
  );
}
