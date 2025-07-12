import { Request, Response } from 'express';
import prisma from '../prismaClient';

interface AuthRequest extends Request {
  userId?: string;
}

// Cadastrar um novo pet
export const createPet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, breed, age, gender, size, isNeutered, objective, description, photoUrl } = req.body;
    const ownerId = req.userId;

    // Validação básica
    if (!ownerId || !name || !breed || !age || !gender || !size || !objective || !photoUrl) {
      return res.status(400).json({ 
        error: 'Preencha todos os campos obrigatórios: name, breed, age, gender, size, objective, photoUrl e esteja autenticado.' 
      });
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Criar o pet
    const pet = await prisma.pet.create({
      data: {
        name,
        breed,
        age: parseInt(age),
        gender,
        size,
        isNeutered: Boolean(isNeutered),
        objective,
        description,
        photoUrl,
        ownerId
      }
    });

    res.status(201).json({ pet });
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Listar pets de um usuário
export const getUserPets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const pets = await prisma.pet.findMany({
      where: { ownerId: userId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      }
    });

    res.json({ pets });
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Buscar um pet específico
export const getPet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      }
    });

    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado.' });
    }

    res.json({ pet });
  } catch (error) {
    console.error('Erro ao buscar pet:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Atualizar um pet
export const updatePet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const userId = req.userId;

    // Verificar se o pet existe e pertence ao usuário autenticado
    const existingPet = await prisma.pet.findUnique({ where: { id } });
    if (!existingPet) {
      return res.status(404).json({ error: 'Pet não encontrado.' });
    }
    if (existingPet.ownerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para editar este pet.' });
    }

    // Atualizar o pet
    const pet = await prisma.pet.update({
      where: { id },
      data: updateData
    });

    res.json({ pet });
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// Remover um pet
export const deletePet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Verificar se o pet existe e pertence ao usuário autenticado
    const existingPet = await prisma.pet.findUnique({ where: { id } });
    if (!existingPet) {
      return res.status(404).json({ error: 'Pet não encontrado.' });
    }
    if (existingPet.ownerId !== userId) {
      return res.status(403).json({ error: 'Você não tem permissão para remover este pet.' });
    }

    // Remover o pet
    await prisma.pet.delete({ where: { id } });

    res.json({ message: 'Pet removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover pet:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getPetsToSwipe = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // Busca todos os pets que NÃO são do usuário logado
    const pets = await prisma.pet.findMany({
      where: {
        ownerId: { not: userId }
      }
    });
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pets para swipe.' });
  }
};