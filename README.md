
# Wristora

Wristora is a full-featured web application for e-commerce and product management, built with Java EE, Hibernate ORM, and a modern HTML/CSS/JS frontend. It supports user and admin authentication, product CRUD, order management, and more.

---

## Table of Contents
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [License](#license)
- [Author](#author)

---


## Project Structure

- `src/java/controller/` - Java servlets for authentication, product, order, and session management
- `src/java/hibernate/` - Hibernate entity classes and configuration
- `src/java/model/` - Utility classes (validation, mail, session filters)
- `web/` - Web resources (HTML, CSS, JS, images)
  - `web/assets/css/` - Stylesheets
  - `web/assets/js/` - JavaScript files
  - `web/assets/img/` - Images
  - `web/adminDash.html` - Admin dashboard
- `lib/` - External libraries (JARs)
- `db/` - Database models and backups
- `build/` - Build output and generated files
- `nbproject/` - NetBeans project configuration

---


## Getting Started

### Prerequisites
- Java Development Kit (JDK) 8 or higher
- Apache Ant
- NetBeans IDE (recommended)
- MySQL (for database)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/NisalSandaru/Wristora.git
   ```
2. Open the project in NetBeans IDE.
3. Configure your database connection in `src/java/hibernate.cfg.xml`.
4. Build the project using NetBeans or:
   ```sh
   ant clean
   ant build
   ```
5. Deploy the application to your Java EE server (e.g., GlassFish).

---


## Features

- User registration, sign-in, and account verification (with email code)
- Admin authentication and session management
- Product management: add, edit, delete, search, and view products
- Order management: checkout, order status, and history
- Cart and wishlist functionality
- Address management for users
- Hibernate ORM for database operations
- Email notifications for verification and order updates
- Responsive admin dashboard with sidebar navigation
- RESTful API endpoints for frontend/backend integration

---


## Usage

- Users can register, sign in, verify accounts, manage addresses, and shop for products.
- Admins can sign in, manage products, view orders, and access analytics via the admin dashboard (`web/adminDash.html`).
- All major actions (sign in, sign up, product CRUD, checkout) are handled via RESTful endpoints in the `src/java/controller/` package.

---

## API Endpoints (Examples)

- `/SignUp` - User registration (POST)
- `/SignIn` - User login (POST)
- `/VerifyAccount` - Account verification (POST)
- `/SignOut` - User sign out (GET)
- `/AdminSignIn` - Admin login (POST)
- `/AdSignOut` - Admin sign out (GET)
- `/AddBrand` - Add a new brand (POST)
- `/AddColor` - Add a new color (POST)
- `/AddModel` - Add a new model (POST)
- `/AddToCart` - Add item to cart (POST)
- `/AddToWishlist` - Add item to wishlist (POST)
- `/CheckOut` - Checkout process (POST)
- `/CheckSessionCart` - Check session cart (GET)
- `/CheckSessionWish` - Check session wishlist (GET)
- `/CityData` - Get city data (GET)
- `/Items` - Get items (GET)
- `/LoadAdDashCount` - Get dashboard analytics (GET)
- `/LoadAdOrderItems` - Get admin order items (GET)
- `/LoadAdProItems` - Get admin product items (GET)
- `/LoadCartItems` - Get cart items (GET)
- `/LoadCheckOutData` - Get checkout data (GET)
- `/LoadData` - Get general data (GET)
- `/LoadHomeData` - Get home page data (GET)
- `/LoadItems` - Get order items (GET)
- `/loadOrderItems` - Get order items (GET)
- `/LoadProdcutData` - Get product data (GET)
- `/LoadSingleProduct` - Get product details (GET)
- `/LoadWishlistItems` - Get wishlist items (GET)
- `/MyAccount` - User account management (GET/PUT)
- `/MyAddress` - User address management (GET)
- `/RemoveCartItems` - Remove items from cart (POST)
- `/RemoveWishItems` - Remove items from wishlist (POST)
- `/SaveProduct` - Save new product (POST)
- `/SearchProducts` - Search products (GET)
- `/StatusData` - Get order status data (GET)
- `/UpdateOrderStatus` - Update order status (POST)
- `/UpdateProduct` - Update product info (PUT)
- `/UpdateStatus` - Update product status (POST)
- `/VerifyPayments` - Verify payments (POST)

---


## License
This project is licensed under the MIT License.

---


## Author
Nisal Sandaru
