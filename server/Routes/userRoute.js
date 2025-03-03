import express from 'express';

import { registerUser,loginUser,findUser,users } from '../Controller/userController.js'; // ✅ Corrected path

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/find/:userId', findUser);
router.get('/', users);

export default router;
