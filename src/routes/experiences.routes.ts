import { Router } from 'express';
import { getExperiences, getExperienceDetails } from '../controllers/experience.controller.js';

const router = Router();

router.route('/').get(getExperiences);
router.route('/:id').get(getExperienceDetails);

export default router;