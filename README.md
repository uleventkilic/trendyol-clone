# Trendyol Clone

This project aims to create a basic e-commerce site clone with features like product listing, category-based filtering, search, and detailed product display.

---

## 🚀 Features

- **Homepage**: A homepage where products are listed by categories.
- **Search Functionality**: Search by product name, description, and category.
- **Product Detail Page**: Detailed information about the selected product.
- **Category-Based Listing**: Grouping and displaying products by categories.
- **Responsive Design**: An interface compatible with mobile, tablet, and desktop devices.
- **Hover Zoom Effect**: Enlarging the image when hovering over the product.

---

## 📋 Requirements

To run the project, the following tools must be installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [SQLite3](https://sqlite.org/download.html)

---

## 🔧 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/username/trendyol-clone.git
cd trendyol-clone
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Prepare the Database

Create a `database.db` file and add sample product data:

```sql
INSERT INTO products (name, description, price, image, category)
VALUES ('Product Name', 'Product Description', 99.99, '/images/product1.jpg', 'Category');
```

### 4️⃣ Start the Server

```bash
npm start
```
or

```bash
node server.js
```

### 5️⃣ Open in Browser

You can view your project at:

```
http://localhost:3000
```

---

## 🛠 Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Frontend**: HTML, CSS, JavaScript (Dynamic Rendering with EJS)
- **Design**: Responsive layout using Flexbox and Grid

---

## 🤔 Challenges and Solutions

### 1️⃣ Image Size Inconsistencies
- **Problem**: Different sizes of images used in product cards negatively affected user experience.
- **Solution**: Applied `object-fit: cover;` and set fixed `height` values to crop images consistently.

### 2️⃣ Responsive Design Issues
- **Problem**: The category menu and product grid structure broke on mobile and tablet devices.
- **Solution**: Used media queries to adapt layouts for different screen sizes and integrated a hamburger menu.

### 3️⃣ Long Description Texts
- **Problem**: Product descriptions disrupted card sizes in some cases.
- **Solution**: Added the `text-overflow: ellipsis;` property to CSS and set fixed heights to prevent overflow.

### 4️⃣ Database Integration
- **Problem**: Errors occurred when inserting products into SQLite due to quotation marks.
- **Solution**: Used escape characters (`\`) to handle special characters in SQL queries.

### 5️⃣ Hover Zoom Effect Misalignment
- **Problem**: The zoom effect appeared misaligned on images of different sizes.
- **Solution**: Adjusted CSS to ensure images remained within the designated hover area.
