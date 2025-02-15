import { Router } from 'express';
import multer from 'multer';
import { SecretSantaController } from '../controllers/SecretSantaController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const controller = new SecretSantaController();

router.post(
  '/upload',
  upload.fields([
    { name: 'currentYear', maxCount: 1 },
    { name: 'previousYear', maxCount: 1 }
  ]),
  controller.handleFileUpload.bind(controller)
);

export default router;