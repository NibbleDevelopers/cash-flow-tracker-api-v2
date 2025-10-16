import logger from '../config/logger.js';

/**
 * Get all categories
 */
export const getCategories = async (req, res, next) => {
  try {
    logger.info('GET /api/categories - Fetching all categories', { userId: req.user?.id });
    
    const categories = await req.sheetsService.getCategories();
    
    res.json({
      success: true,
      data: categories,
      count: categories.length
    });
  } catch (error) {
    logger.error('Error in getCategories controller', { error: error.message });
    next(error);
  }
};
