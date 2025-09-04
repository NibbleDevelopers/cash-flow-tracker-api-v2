import GoogleSheetsService from '../services/googleSheetsService.js';
import logger from '../config/logger.js';

const sheetsService = new GoogleSheetsService();

/**
 * Get all categories
 */
export const getCategories = async (req, res, next) => {
  try {
    logger.info('GET /api/categories - Fetching all categories');
    
    const categories = await sheetsService.getCategories();
    
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
