import { Request, Response } from 'express';
import supabase from '../supabaseClient';

// Para lidar com uploads multipart/form-data
import multer from 'multer';
const upload = multer({ 
  storage: multer.memoryStorage(),
  // Aumentar limites para React Native
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

// Middleware para processar uploads base64 (JSON) antes do multer
const processBase64Upload = async (req: Request, res: Response, next: any) => {
  const contentType = req.headers['content-type'] || '';
  
  // Se é JSON (base64 do React Native), processar antes do multer
  if (contentType.includes('application/json')) {
    // O express.json() já processou o body
    if (req.body && req.body.image && typeof req.body.image === 'string') {
      console.log('📤 Detectado upload base64 via JSON');
      // Marcar como já processado para pular multer
      (req as any).skipMulter = true;
      (req as any).base64Data = req.body;
    }
  }
  
  next();
};

export const uploadPetPhoto = [
  // Processar base64 primeiro
  processBase64Upload,
  // Tentar processar com multer (pode ser ignorado se skipMulter = true)
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      console.log('📤 Recebendo upload de pet photo');
      console.log('Request body:', req.body);
      console.log('Request file:', (req as any).file);
      console.log('Request headers:', req.headers);
      console.log('Content-Type:', req.headers['content-type']);
      
      let file = (req as any).file;
      
      // Se foi marcado para pular multer ou não tem file mas tem base64, processar
      if ((req as any).skipMulter || (!file && req.body.image && typeof req.body.image === 'string')) {
        console.log('📤 Processando upload via base64 (React Native)');
        
        try {
          // Converter base64 para buffer
          const base64Data = req.body.image;
          const buffer = Buffer.from(base64Data, 'base64');
          
          const filename = req.body.filename || 'image.jpg';
          const mimetype = req.body.mimetype || 'image/jpeg';
          
          // Criar objeto file compatível com multer
          file = {
            buffer: buffer,
            originalname: filename,
            mimetype: mimetype,
            size: buffer.length,
          };
          
          console.log('✅ Arquivo base64 convertido:', filename, 'Tamanho:', file.size);
        } catch (base64Error) {
          console.error('❌ Erro ao processar base64:', base64Error);
          return res.status(400).json({ error: 'Erro ao processar arquivo base64.' });
        }
      }
      
      if (!file) {
        console.error('❌ Nenhum arquivo enviado');
        console.error('Body keys:', Object.keys(req.body));
        console.error('Body image:', req.body.image ? typeof req.body.image : 'não existe');
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
        
        // Tratamento de erros específicos do Supabase
        if (error.message?.includes('Bucket not found')) {
          return res.status(404).json({ 
            error: 'Bucket de armazenamento não encontrado. Verifique a configuração do Supabase.',
            details: error.message 
          });
        }
        
        // Se o arquivo já existe, tentar novamente com nome mais único
        if (error.message?.includes('The resource already exists')) {
          console.log('⚠️ Arquivo já existe, tentando com nome mais único...');
          const retryFileName = `pets/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.originalname}`;
          const { data: retryData, error: retryError } = await supabase.storage
            .from('pet-photos')
            .upload(retryFileName, file.buffer, {
              contentType: file.mimetype,
              upsert: false
            });
          
          if (retryError) {
            return res.status(500).json({ 
              error: 'Erro ao fazer upload da imagem.', 
              details: retryError.message 
            });
          }
          
          const { data: retryPublicUrlData } = supabase.storage
            .from('pet-photos')
            .getPublicUrl(retryFileName);
          
          console.log('✅ Upload concluído (retry):', retryPublicUrlData.publicUrl);
          return res.status(201).json({ url: retryPublicUrlData.publicUrl });
        }
        
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