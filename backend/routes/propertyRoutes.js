import express from 'express';
import checkAuth from '../middleware/checkAuthMiddleware.js';
import role from '../middleware/roleMiddleware.js';

import getProperty from '../controllers/properties/getProperty.js';
import createProperty from '../controllers/properties/createProperty.js';

const router = express.Router();

router.route(
    '/create',
    checkAuth,
    role.checkRole(role.ROLES.Admin),
    createProperty,
);
router.route(
    '/:id',
    getProperty,
);
export default router;
