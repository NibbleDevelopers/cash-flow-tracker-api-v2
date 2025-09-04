import jwt from 'jsonwebtoken';
import logger from '../config/logger.js';
import { ApiError } from '../middleware/errorHandler.js';
/**
 * Service class for Google Sheets operations
 */
class GoogleSheetsService {
  constructor() {
    this.sheetId = process.env.GOOGLE_SHEET_ID;
    this.credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
      token_uri: 'https://oauth2.googleapis.com/token'
    };
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get access token for Google Sheets API
   */
  async getAccessToken() {
    try {
      // Check if token is still valid
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      logger.info('Generating new Google Sheets access token');

      const now = Math.floor(Date.now() / 1000);
      const payload = {
        iss: this.credentials.client_email,
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        aud: this.credentials.token_uri,
        exp: now + 3600,
        iat: now
      };

      const privateKey = this.credentials.private_key.replace(/\\n/g, '\n');
      
      const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
      
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: token
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Failed to get access token', { status: response.status, error: errorText });
        throw new ApiError(500, 'Failed to authenticate with Google Sheets API');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      logger.info('Successfully obtained Google Sheets access token');
      return this.accessToken;
    } catch (error) {
      logger.error('Error getting access token', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Make authenticated request to Google Sheets API
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const token = await this.getAccessToken();
      
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}${endpoint}`;
      
      logger.debug('Making Google Sheets API request', { url, method: options.method || 'GET' });
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Google Sheets API error', { 
          status: response.status, 
          endpoint, 
          error: errorText 
        });
        throw new ApiError(response.status, `Google Sheets API error: ${errorText}`);
      }

      const data = await response.json();
      logger.debug('Google Sheets API response received', { endpoint, dataSize: JSON.stringify(data).length });
      
      return data;
    } catch (error) {
      logger.error('Error making Google Sheets request', { 
        endpoint, 
        error: error.message, 
        stack: error.stack 
      });
      throw error;
    }
  }

  /**
   * Get categories from Google Sheets
   */
  async getCategories() {
    try {
      logger.info('Fetching categories from Google Sheets');
      const response = await this.makeRequest('/values/Categories!A:D');
      const categories = response.values || [];
      logger.info('Categories fetched successfully', { count: categories.length });
      return categories;
    } catch (error) {
      logger.error('Error fetching categories', { error: error.message });
      throw error;
    }
  }

  /**
   * Get expenses from Google Sheets
   */
  async getExpenses() {
    try {
      logger.info('Fetching expenses from Google Sheets');
      const response = await this.makeRequest('/values/Expenses!A:F');
      const expenses = response.values || [];
      logger.info('Expenses fetched successfully', { count: expenses.length });
      return expenses;
    } catch (error) {
      logger.error('Error fetching expenses', { error: error.message });
      throw error;
    }
  }

  /**
   * Add new expense to Google Sheets
   */
  async addExpense(expense) {
    try {
      logger.info('Adding new expense to Google Sheets', { 
        description: expense.description, 
        amount: expense.amount 
      });

      const values = [[
        expense.id,
        expense.date,
        expense.description,
        expense.amount.toString(),
        expense.categoryId.toString(),
        expense.isFixed ? 'TRUE' : 'FALSE'
      ]];

      const response = await this.makeRequest('/values/Expenses!A:F:append?valueInputOption=RAW', {
        method: 'POST',
        body: JSON.stringify({ values })
      });

      logger.info('Expense added successfully', { expenseId: expense.id });
      return response;
    } catch (error) {
      logger.error('Error adding expense', { 
        expense: expense.description, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Get budget from Google Sheets
   */
  async getBudget() {
    try {
      logger.info('Fetching budget from Google Sheets');
      const response = await this.makeRequest('/values/Budget!A:B');
      const budget = response.values || [];
      logger.info('Budget fetched successfully', { count: budget.length });
      return budget;
    } catch (error) {
      logger.error('Error fetching budget', { error: error.message });
      throw error;
    }
  }

  /**
   * Update budget in Google Sheets
   */
  async updateBudget(budget) {
    try {
      logger.info('Updating budget in Google Sheets', { 
        month: budget.month, 
        amount: budget.amount 
      });

      const values = [[
        budget.month,
        budget.amount.toString()
      ]];

      const response = await this.makeRequest('/values/Budget!A:B?valueInputOption=RAW', {
        method: 'PUT',
        body: JSON.stringify({ values })
      });

      logger.info('Budget updated successfully', { month: budget.month });
      return response;
    } catch (error) {
      logger.error('Error updating budget', { 
        month: budget.month, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Get fixed expenses from Google Sheets
   */
  async getFixedExpenses() {
    try {
      logger.info('Fetching fixed expenses from Google Sheets');
      const response = await this.makeRequest('/values/FixedExpenses!A:F');
      const fixedExpenses = response.values || [];
      logger.info('Fixed expenses fetched successfully', { count: fixedExpenses.length });
      return fixedExpenses;
    } catch (error) {
      logger.error('Error fetching fixed expenses', { error: error.message });
      throw error;
    }
  }

  /**
   * Add new fixed expense to Google Sheets
   */
  async addFixedExpense(fixedExpense) {
    try {
      logger.info('Adding new fixed expense to Google Sheets', { 
        name: fixedExpense.name, 
        amount: fixedExpense.amount 
      });

      const values = [[
        fixedExpense.id,
        fixedExpense.name,
        fixedExpense.amount.toString(),
        fixedExpense.categoryId.toString(),
        fixedExpense.dayOfMonth.toString(),
        fixedExpense.active ? 'TRUE' : 'FALSE'
      ]];

      const response = await this.makeRequest('/values/FixedExpenses!A:F:append?valueInputOption=RAW', {
        method: 'POST',
        body: JSON.stringify({ values })
      });

      logger.info('Fixed expense added successfully', { expenseId: fixedExpense.id });
      return response;
    } catch (error) {
      logger.error('Error adding fixed expense', { 
        name: fixedExpense.name, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Update fixed expense in Google Sheets
   */
  async updateFixedExpense(fixedExpense) {
    try {
      logger.info('Updating fixed expense in Google Sheets', { 
        id: fixedExpense.id, 
        name: fixedExpense.name 
      });

      // Only include defined values
      const values = [[
        fixedExpense.id,
        fixedExpense.name || '',
        fixedExpense.amount ? fixedExpense.amount.toString() : '',
        fixedExpense.categoryId ? fixedExpense.categoryId.toString() : '',
        fixedExpense.dayOfMonth ? fixedExpense.dayOfMonth.toString() : '',
        fixedExpense.active !== undefined ? (fixedExpense.active ? 'TRUE' : 'FALSE') : ''
      ]];

      const response = await this.makeRequest('/values/FixedExpenses!A:F?valueInputOption=RAW', {
        method: 'PUT',
        body: JSON.stringify({ values })
      });

      logger.info('Fixed expense updated successfully', { expenseId: fixedExpense.id });
      return response;
    } catch (error) {
      logger.error('Error updating fixed expense', { 
        id: fixedExpense.id, 
        error: error.message 
      });
      throw error;
    }
  }

  /**
   * Generate fixed expenses for a specific month
   */
  async generateFixedExpensesForMonth(month) {
    try {
      logger.info('Generating fixed expenses for month', { month });
      
      const fixedExpenses = await this.getFixedExpenses();
      const monthStart = new Date(`${month}-01`);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const generatedExpenses = [];
      
      for (const fixedExpense of fixedExpenses.slice(1)) { // Skip header
        if (fixedExpense[5] === 'TRUE') { // If active
          const dayOfMonth = parseInt(fixedExpense[4]);
          const expenseDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), dayOfMonth);
          
          // Only generate if the date is valid for this month
          if (expenseDate >= monthStart && expenseDate <= monthEnd) {
            generatedExpenses.push({
              id: Date.now() + Math.random().toString(36).substr(2, 9),
              date: expenseDate.toISOString().split('T')[0],
              description: fixedExpense[1],
              amount: parseFloat(fixedExpense[2]),
              categoryId: parseInt(fixedExpense[3]),
              isFixed: true,
              fixedExpenseId: fixedExpense[0]
            });
          }
        }
      }
      
      logger.info('Fixed expenses generated successfully', { 
        month, 
        count: generatedExpenses.length 
      });
      
      return generatedExpenses;
    } catch (error) {
      logger.error('Error generating fixed expenses', { month, error: error.message });
      throw error;
    }
  }

  /**
   * Check if fixed expense already exists
   */
  async checkFixedExpenseExists(description, categoryId) {
    try {
      logger.debug('Checking if fixed expense exists', { description, categoryId });
      
      const fixedExpenses = await this.getFixedExpenses();
      const exists = fixedExpenses.slice(1).some(expense => 
        expense[1] === description && parseInt(expense[3]) === categoryId
      );
      
      logger.debug('Fixed expense existence check result', { description, categoryId, exists });
      return exists;
    } catch (error) {
      logger.error('Error checking fixed expense existence', { 
        description, 
        categoryId, 
        error: error.message 
      });
      throw error;
    }
  }
}

export default GoogleSheetsService;
