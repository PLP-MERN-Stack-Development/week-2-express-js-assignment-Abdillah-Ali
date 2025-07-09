// server.js - Starter Express server for Week 2 assignment

// Import required modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

// Apply authentication middleware to all /api/products routes except GET
app.use('/api/products', (req, res, next) => {
  if (req.method === 'GET') {
    return next();
  }
  authenticate(req, res, next);
});

// Validation middleware for product creation and update
const validateProduct = (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      throw new ValidationError('Missing required fields');
    }
    if (typeof price !== 'number') {
      throw new ValidationError('Price must be a number');
    }
    next();
  } catch (error) {
    next(error);
  }
};

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products/:id - Get a specific product
// POST /api/products - Create a new product
// PUT /api/products/:id - Update a product
// DELETE /api/products/:id - Delete a product

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  let filteredProducts = [...products];
  const { category, page = 1, limit = 10 } = req.query;
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    page: parseInt(page),
    limit: parseInt(limit),
    total: filteredProducts.length,
    data: paginatedProducts
  });
});

// Get product statistics
app.get('/api/products/stats', (req, res) => {
  const stats = products.reduce((acc, product) => {
    if (acc[product.category]) {
      acc[product.category]++;
    } else {
      acc[product.category] = 1;
    }
    return acc;
  }, {});
  res.json(stats);
});

// Search for products by name
app.get('/api/products/search', (req, res) => {
  const { name } = req.query;
  const searchResults = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  res.json(searchResults);
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      throw new NotFoundError('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create a new product
app.post('/api/products', validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock: inStock || false
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', validateProduct, (req, res, next) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex !== -1) {
      const { name, description, price, category, inStock } = req.body;
      products[productIndex] = {
        id: req.params.id,
        name,
        description,
        price,
        category,
        inStock: inStock || false
      };
      res.json(products[productIndex]);
    } else {
      throw new NotFoundError('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res, next) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      res.status(204).send();
    } else {
      throw new NotFoundError('Product not found');
    }
  } catch (error) {
    next(error);
  }
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  res.status(statusCode).json({ error: message });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
