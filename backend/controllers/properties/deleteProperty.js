import asyncHandler from 'express-async-handler';
import Property from '../../models/propertiesModel.js';

// $-title   Delete property
// $-path    Delete /api/v1/property/:ID
// $-auth    Private

const deleteProperty = asyncHandler(async (req, res) => {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (property) {
        res.json({
            success: true,
            message: 'Property was deleted!',
        });
    } else {
        res.status(404).json({ message: 'Not found property to delete' });
    }
});

export default deleteProperty;