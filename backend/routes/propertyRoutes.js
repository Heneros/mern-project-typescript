import express from 'express';
import checkAuth from '../middleware/checkAuthMiddleware.js';
import role from '../middleware/roleMiddleware.js';

import getProperty from '../controllers/properties/getProperty.js';
import createProperty from '../controllers/properties/createProperty.js';
import deleteProperty from '../controllers/properties/deleteProperty.js';
import updateProperty from '../controllers/properties/updateProperty.js';
import getAllProperties from '../controllers/properties/getProperties.js';

const router = express.Router();

router
    .route('/create')
    .post(checkAuth, role.checkRole(role.ROLES.Admin), createProperty);

router.route('/').get(getAllProperties);

router.route('/:id').get(getProperty);

router
    .route('/:id')
    .delete(checkAuth, role.checkRole(role.ROLES.Admin), deleteProperty);

router
    .route('/:id')
    .patch(checkAuth, role.checkRole(role.ROLES.Admin), updateProperty);

export default router;
