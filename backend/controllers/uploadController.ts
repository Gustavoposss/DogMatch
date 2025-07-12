import { Request, Response } from 'express';
import supabase from '../supabaseClient';

// Para lidar com uploads multipart/form-data
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

export const uploadPetPhoto = [
  upload.single('photo'),
  async (req: Request, res: Response) => {
    try {
      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }

      // Nome único para o arquivo
      const fileName = `pets/${Date.now()}_${file.originalname}`;

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('pet-photos') // nome do bucket (crie no painel do Supabase)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype
        });

      if (error) {
        return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
      }

      // URL pública da imagem
      const publicUrl = supabase.storage.from('pet-photos').getPublicUrl(fileName).data.publicUrl;

      res.status(201).json({ url: publicUrl });
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
];