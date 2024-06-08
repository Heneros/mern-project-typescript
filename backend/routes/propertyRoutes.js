import express from 'express';
import checkAuth from '../middleware/checkAuthMiddleware';
import role from '../middleware/roleMiddleware';

import getProperty from '../controllers/properties/getProperty';
import createProperty from '../controllers/properties/createProperty';

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
