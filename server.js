const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Database = require('better-sqlite3');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Database setup (using better-sqlite3)
const db = new Database('./database/database.db', { verbose: console.log });

// Homepage - Product Count by Category and Featured Products
app.get('/', (req, res) => {
  const categoryQuery = `SELECT category, COUNT(*) as product_count FROM products GROUP BY category`;
  const productQuery = `SELECT * FROM products LIMIT 20`;

  try {
    const categories = db.prepare(categoryQuery).all();
    const products = db.prepare(productQuery).all();
    res.render('index', { categories, products });
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).send('Server error');
  }
});

// Search Page
app.get('/search', (req, res) => {
  const keyword = req.query.q || ''; // Arama terimi
  const categoryQuery = `SELECT category, COUNT(*) as product_count FROM products GROUP BY category`;
  const productQuery = `
    SELECT * FROM products 
    WHERE name LIKE ? OR description LIKE ? OR category LIKE ? OR CAST(product_no AS TEXT) LIKE ?`; // product_no'yu metne çevirerek arama yapılır

  try {
    const categories = db.prepare(categoryQuery).all();
    const products = db.prepare(productQuery).all(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    res.render('search', { products, categories, keyword });
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).send('Server error');
  }
});

// Detail Page (with Breadcrumbs)
app.get('/detail/:id', (req, res) => {
  const productId = req.params.id;
  const productQuery = `SELECT * FROM products WHERE id = ?`;
  const categoryQuery = `SELECT category, COUNT(*) as product_count FROM products GROUP BY category`;

  try {
    const categories = db.prepare(categoryQuery).all();
    const product = db.prepare(productQuery).get(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    const breadcrumbs = [
      { name: "Homepage", url: "/" },
      { name: product.category, url: `/search?q=${product.category}` },
      { name: product.name, url: `/detail/${product.id}` }
    ];

    res.render('detail', { product, breadcrumbs, categories });
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).send('Server error');
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
