import express from 'express';
import {
  login,
  register,
  requestPasswordReset,
  resetPasswordWithCode,
} from '../controllers/authController';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPasswordWithCode);

export default router;