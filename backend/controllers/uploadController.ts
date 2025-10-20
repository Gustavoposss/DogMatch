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
        console.error('❌ Nenhum arquivo enviado');
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }

      console.log('📤 Iniciando upload:', file.originalname, 'Tamanho:', file.size);

      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        console.error('❌ Tipo de arquivo inválido:', file.mimetype);
        return res.status(400).json({ error: 'Formato de arquivo não suportado. Use JPG, PNG ou WebP.' });
      }

      // Validar tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('❌ Arquivo muito grande:', file.size);
        return res.status(400).json({ error: 'Arquivo muito grande. Tamanho máximo: 5MB.' });
      }

      // Nome único para o arquivo
      const fileName = `pets/${Date.now()}_${file.originalname}`;

      console.log('☁️ Fazendo upload para Supabase:', fileName);

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('pet-photos')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        return res.status(500).json({ 
          error: 'Erro ao fazer upload da imagem.', 
          details: error.message 
        });
      }

      // URL pública da imagem
      const { data: publicUrlData } = supabase.storage
        .from('pet-photos')
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      console.log('✅ Upload concluído:', publicUrl);

      res.status(201).json({ url: publicUrl });
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor.',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
];