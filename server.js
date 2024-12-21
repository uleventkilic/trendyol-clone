const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Database setup
const db = new sqlite3.Database('./database/database.db', (err) => {
  if (err) console.error('Database error:', err.message);
  else console.log('Database connected successfully.');
});

// Homepage - Product Count by Category and Featured Products
app.get('/', (req, res) => {
  const categoryQuery = `SELECT category, COUNT(*) as product_count FROM products GROUP BY category`;
  const productQuery = `SELECT * FROM products LIMIT 20`;

  db.all(categoryQuery, [], (err, categories) => {
    if (err) {
      console.error('Category query error:', err.message);
      return res.status(500).send('Server error');
    }

    db.all(productQuery, [], (err, products) => {
      if (err) {
        console.error('Product query error:', err.message);
        return res.status(500).send('Server error');
      }

      res.render('index', { categories, products });
    });
  });
});

// Search Page
app.get('/search', (req, res) => {
  const keyword = req.query.q || ''; // Arama terimi
  const categoryQuery = `SELECT category, COUNT(*) as product_count FROM products GROUP BY category`;
  const productQuery = `
    SELECT * FROM products 
    WHERE name LIKE ? OR description LIKE ? OR category LIKE ? OR CAST(product_no AS TEXT) LIKE ?`; // product_no'yu metne çevirerek arama yapılır

  db.all(categoryQuery, [], (err, categories) => {
    if (err) {
      console.error('Category query error:', err.message);
      return res.status(500).send('Server error');
    }

    db.all(
      productQuery,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`],
      (err, products) => {
        if (err) {
          console.error('Product query error:', err.message);
          return res.status(500).send('Server error');
        }

        res.render('search', { products, categories, keyword });
      }
    );
  });
});

// Detail Page (with Breadcrumbs)
app.get('/detail/:id', (req, res) => {
  const productId = req.params.id;
  const productQuery = `SELECT * FROM products WHERE id = ?`;
  const categoryQuery = `SELECT category, COUNT(*) as product_count FROM products GROUP BY category`;

  db.all(categoryQuery, [], (err, categories) => {
    if (err) {
      console.error('Category query error:', err.message);
      return res.status(500).send('Server error');
    }

    db.get(productQuery, [productId], (err, product) => {
      if (err) {
        console.error('Product query error:', err.message);
        return res.status(500).send('Server error');
      }
      if (!product) {
        return res.status(404).send('Product not found');
      }

      const breadcrumbs = [
        { name: "Homepage", url: "/" },
        { name: product.category, url: `/search?q=${product.category}` },
        { name: product.name, url: `/detail/${product.id}` }
      ];

      res.render('detail', { product, breadcrumbs, categories });
    });
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
