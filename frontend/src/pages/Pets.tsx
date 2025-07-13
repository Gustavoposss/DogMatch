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
          setPets(data);
        })
        .catch((err) => {
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
    <div className="min-h-[100vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-2">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Meus Pets</h2>
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-blue-50 rounded-2xl shadow-md p-4 w-56 flex flex-col items-center">
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-28 h-28 object-cover rounded-xl mb-3 border-2 border-blue-200 shadow"
                onError={e => (e.currentTarget.src = 'https://via.placeholder.com/120')}
              />
              <div className="font-bold text-lg text-gray-800 mb-1">{pet.name}</div>
              <div className="text-gray-600 mb-1">{pet.breed}</div>
              <div className="text-gray-500 mb-2">{pet.age} anos</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(pet)} className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-semibold text-sm shadow transition-all">Editar</button>
                <button onClick={() => handleDelete(pet.id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm shadow transition-all">Remover</button>
              </div>
            </div>
          ))}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{editingPet ? 'Editar pet' : 'Cadastrar novo pet'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Raça"
            value={breed}
            onChange={e => setBreed(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Idade"
            value={age}
            onChange={e => setAge(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select value={gender} onChange={e => setGender(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Selecione o gênero</option>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>
          <select value={size} onChange={e => setSize(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Selecione o porte</option>
            <option value="pequeno">Pequeno</option>
            <option value="médio">Médio</option>
            <option value="grande">Grande</option>
          </select>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <input type="checkbox" checked={isNeutered} onChange={e => setIsNeutered(e.target.checked)} className="form-checkbox h-5 w-5 text-blue-600" />
            Castrado?
          </label>
          <select value={objective} onChange={e => setObjective(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-4 mt-2">
            <button type="submit" className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
              {editingPet ? 'Salvar Alterações' : 'Cadastrar Pet'}
            </button>
            {editingPet && (
              <button type="button" onClick={() => setEditingPet(null)} className="w-full md:w-auto px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-all">
                Cancelar
              </button>
            )}
          </div>
          {error && <p className="col-span-1 md:col-span-2 text-red-600 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Pets;