import express from 'express';
import checkAuth from '../middleware/checkAuthMiddleware';
import role from '../middleware/roleMiddleware';

import getProperty from '../controllers/properties/getProperty';
import createProperty from '../controllers/properties/createProperty';
import deleteProperty from '../controllers/properties/deleteProperty';
import updateProperty from '../controllers/properties/updateProperty';
import getAllProperties from '../controllers/properties/getProperties';

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
