import { Request, Response } from 'express';
import prisma from '../prismaClient';
import { UsageLimitService } from '../services/usageLimitService';

interface AuthRequest extends Request {
  userId?: string;
}

export const likePet = async (req: AuthRequest, res: Response) => {
  try {
    const { toPetId } = req.body;
    const userId = req.userId;

    // VERIFICAR LIMITE DE SWIPES
    const swipeCheck = await UsageLimitService.canSwipe(userId!);
    if (!swipeCheck.canSwipe) {
      return res.status(403).json({ 
        error: swipeCheck.reason,
        limitReached: true,
        upgradeRequired: true
      });
    }

    // Buscar o pet do usuário autenticado
    const fromPet = await prisma.pet.findFirst({
      where: { ownerId: userId }
    });

    if (!fromPet) {
      return res.status(404).json({ error: 'Você não possui um pet cadastrado.' });
    }

    // Verificar se já curtiu esse pet antes
    const existingLike = await prisma.like.findFirst({
      where: {
        fromPetId: fromPet.id,
        toPetId
      }
    });

    if (existingLike) {
      return res.status(409).json({ error: 'Você já curtiu esse pet.' });
    }

    // Registrar o like
    await prisma.like.create({
      data: {
        fromPetId: fromPet.id,
        toPetId
      }
    });

    // INCREMENTAR CONTADOR DE SWIPES
    await UsageLimitService.incrementSwipeCount(userId!);

    // Verificar se houve match (o outro pet já curtiu o seu)
    const reciprocalLike = await prisma.like.findFirst({
      where: {
        fromPetId: toPetId,
        toPetId: fromPet.id
      }
    });

    if (reciprocalLike) {
      // Criar o match
      await prisma.match.create({
        data: {
          petAId: fromPet.id,
          petBId: toPetId,
          userAId: fromPet.ownerId,
          userBId: (await prisma.pet.findUnique({ where: { id: toPetId } }))?.ownerId || ''
        }
      });
      return res.status(201).json({ message: 'Match realizado!', isMatch: true });
    }

    // Retornar swipes restantes
    const updatedCheck = await UsageLimitService.canSwipe(userId!);

    res.status(201).json({ 
      message: 'Like registrado!',
      isMatch: false,
      swipesRemaining: updatedCheck.remaining 
    });
  } catch (error) {
    console.error('Erro ao curtir pet:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const getAvailablePets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    // Buscar todos os pets do usuário autenticado
    const myPets = await prisma.pet.findMany({
      where: { ownerId: userId },
      select: { id: true }
    });
    const myPetIds = myPets.map(pet => pet.id);

    // Buscar pets já curtidos pelos meus pets
    const likes = await prisma.like.findMany({
      where: { fromPetId: { in: myPetIds } },
      select: { toPetId: true }
    });
    const likedPetIds = likes.map(like => like.toPetId);

    // Extrair filtros da query
    const { 
      city, 
      size, 
      gender, 
      objective, 
      breed, 
      minAge, 
      maxAge,
      isNeutered 
    } = req.query;

    // Construir objeto de filtros
    const filters: any = {
      id: { notIn: [...myPetIds, ...likedPetIds] }
    };

    // Aplicar filtros se fornecidos
    if (city) filters.city = String(city);
    if (size) filters.size = String(size);
    if (gender) filters.gender = String(gender);
    if (objective) filters.objective = String(objective);
    if (breed) filters.breed = { contains: String(breed), mode: 'insensitive' };
    if (isNeutered !== undefined) filters.isNeutered = isNeutered === 'true';

    // Filtro de idade
    if (minAge || maxAge) {
      filters.age = {};
      if (minAge) filters.age.gte = parseInt(String(minAge));
      if (maxAge) filters.age.lte = parseInt(String(maxAge));
    }

    // Buscar pets disponíveis para swipe com filtros
    const availablePets = await prisma.pet.findMany({
      where: filters,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ pets: availablePets });
  } catch (error) {
    console.error('Erro ao buscar pets para swipe:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export const like = async (req: Request, res: Response) => {
  const { fromPetId, toPetId } = req.body;
  try {
    // Cria o like
    const like = await prisma.like.create({
      data: {
        fromPetId,
        toPetId,
      },
    });

    // Verifica se já existe like recíproco
    const reciprocalLike = await prisma.like.findFirst({
      where: {
        fromPetId: toPetId,
        toPetId: fromPetId,
      },
    });

    let match = null;
    if (reciprocalLike) {
      const petA = await prisma.pet.findUnique({ where: { id: fromPetId } });
      const petB = await prisma.pet.findUnique({ where: { id: toPetId } });

      if (!petA || !petB) {
        return res.status(404).json({ error: 'Pet não encontrado.' });
      }

      match = await prisma.match.create({
        data: {
          petAId: fromPetId,
          petBId: toPetId,
          userAId: petA.ownerId,
          userBId: petB.ownerId,
        },
      });
    }

    res.json({ like, match });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar like.' });
  }
};

export const getFilterOptions = async (req: Request, res: Response) => {
  try {
    // Buscar cidades únicas
    const cities = await prisma.user.findMany({
      select: { city: true },
      distinct: ['city']
    });

    // Buscar raças únicas
    const breeds = await prisma.pet.findMany({
      select: { breed: true },
      distinct: ['breed']
    });

    // Opções de tamanho
    const sizes = ['pequeno', 'médio', 'grande'];

    // Opções de gênero
    const genders = ['M', 'F'];

    // Opções de objetivo
    const objectives = ['amizade', 'cruzamento', 'adoção'];

    // Idades disponíveis (1-20 anos)
    const ages = Array.from({ length: 20 }, (_, i) => i + 1);

    res.json({
      cities: cities.map(c => c.city),
      breeds: breeds.map(b => b.breed),
      sizes,
      genders,
      objectives,
      ages
    });
  } catch (error) {
    console.error('Erro ao buscar opções de filtros:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};