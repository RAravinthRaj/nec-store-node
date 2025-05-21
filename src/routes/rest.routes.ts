/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Router } from 'express';
import { signIn } from '@/src/controllers/signIn.controller';
import { createUser } from '@/src/controllers/createUser.controller';
import { verifyOtp } from '@/src/controllers/verifyOtp.controller';

const router = Router();

router.post('/signup', createUser);
router.post('/signin', signIn);
router.post('/verify', verifyOtp);

export default router;
