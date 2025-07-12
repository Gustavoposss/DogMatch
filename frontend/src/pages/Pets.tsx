import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getPetsByUser, createPet, updatePet, deletePet } from '../services/petService';

interface JwtPayload {
  userId: string;
}

function Pets() {
  const [pets, setPets] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  let userId = '';

  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    userId = decoded.userId;
  }

  useEffect(() => {
    if (userId && token) {
      getPetsByUser(userId, token)
        .then((data) => {
          console.log('Pets recebidos:', data);
          setPets(data);
        })
        .catch((err) => {
          console.error('Erro ao buscar pets:', err);
          setPets([]);
        });
    }
  }, [userId, token]);

  const [gender, setGender] = useState('');
  const [size, setSize] = useState('');
  const [isNeutered, setIsNeutered] = useState(false);
  const [objective, setObjective] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://via.placeholder.com/150');
  const [editingPet, setEditingPet] = useState<any>(null);

  function handleEdit(pet: any) {
    setEditingPet(pet);
    setName(pet.name);
    setBreed(pet.breed);
    setAge(String(pet.age));
    setGender(pet.gender);
    setSize(pet.size);
    setIsNeutered(pet.isNeutered);
    setObjective(pet.objective);
    setPhotoUrl(pet.photoUrl);
  }

  async function handleDelete(id: string) {
    if (window.confirm('Tem certeza que deseja remover este pet?')) {
      await deletePet(id, token!);
      setPets(pets.filter(p => p.id !== id));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingPet) {
        const updatedPet = await updatePet(editingPet.id, {
          name, breed, age: Number(age), gender, size, isNeutered, objective,
          photoUrl: photoUrl.trim() !== '' ? photoUrl : 'https://via.placeholder.com/150',
          ownerId: userId
        }, token!);
        setPets(pets.map(p => p.id === editingPet.id ? updatedPet : p));
        setEditingPet(null);
      } else {
        const newPet = await createPet({
          name, breed, age: Number(age), gender, size, isNeutered, objective,
          photoUrl: photoUrl.trim() !== '' ? photoUrl : 'https://via.placeholder.com/150',
          ownerId: userId
        }, token!);
        setPets([...pets, newPet]);
      }
      // Limpa o formulário
      setName('');
      setBreed('');
      setAge('');
      setGender('');
      setSize('');
      setIsNeutered(false);
      setObjective('');
      setPhotoUrl('');
    } catch {
      setError(editingPet ? 'Erro ao editar pet.' : 'Erro ao cadastrar pet.');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
      <h2>Meus Pets</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        {pets.map((pet) => (
          <div key={pet.id} style={{
            background: '#f9f9f9',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            padding: 16,
            width: 180,
            textAlign: 'center'
          }}>
            <img
              src={pet.photoUrl}
              alt={pet.name}
              style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
              onError={e => (e.currentTarget.src = 'https://via.placeholder.com/120')}
            />
            <div><strong>{pet.name}</strong></div>
            <div>{pet.breed}</div>
            <div>{pet.age} anos</div>
            <button onClick={() => handleEdit(pet)}>Editar</button>
            <button onClick={() => handleDelete(pet.id)}>Remover</button>
          </div>
        ))}
      </div>
      <h3>Cadastrar novo pet</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          type="text"
          placeholder="Raça"
          value={breed}
          onChange={e => setBreed(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <input
          type="number"
          placeholder="Idade"
          value={age}
          onChange={e => setAge(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <select value={gender} onChange={e => setGender(e.target.value)} required>
          <option value="">Selecione o gênero</option>
          <option value="M">Macho</option>
          <option value="F">Fêmea</option>
        </select>
        <select value={size} onChange={e => setSize(e.target.value)} required>
          <option value="">Selecione o porte</option>
          <option value="pequeno">Pequeno</option>
          <option value="médio">Médio</option>
          <option value="grande">Grande</option>
        </select>
        <label>
          Castrado?
          <input type="checkbox" checked={isNeutered} onChange={e => setIsNeutered(e.target.checked)} />
        </label>
        <select value={objective} onChange={e => setObjective(e.target.value)} required>
          <option value="">Selecione o objetivo</option>
          <option value="amizade">Amizade</option>
          <option value="cruzamento">Cruzamento</option>
          <option value="adoção">Adoção</option>
        </select>
        <input
          type="text"
          placeholder="URL da foto"
          value={photoUrl}
          onChange={e => setPhotoUrl(e.target.value)}
          style={{ width: '100%', marginBottom: 8, padding: 8 }}
        />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#4299e1', color: '#fff', border: 'none', borderRadius: 6 }}>
          {editingPet ? 'Salvar Alterações' : 'Cadastrar Pet'}
        </button>
        {editingPet && (
          <button type="button" onClick={() => setEditingPet(null)} style={{ marginLeft: 8 }}>
            Cancelar
          </button>
        )}
        {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      </form>
    </div>
  );
}

export default Pets;