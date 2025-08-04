# Wristora

Wristora is a web application for user management and product administration. This repository contains all source code, configuration files, and resources for the Wristora platform.

## Project Structure

- `src/` - Java source code and configuration files
- `src/java/controller/` - Servlets and controllers
- `src/java/hibernate/` - Hibernate utility and entity classes
- `src/java/model/` - Utility and filter classes
- `web/` - Web resources (HTML, CSS, JS, images)
- `web/assets/css/` - Stylesheets
- `web/assets/js/` - JavaScript files
- `web/assets/img/` - Images
- `web/admingDash.html` - Admin dashboard
- `lib/` - External libraries and dependencies
- `db/` - Database models and backups
- `build/` - Build output and generated files
- `nbproject/` - NetBeans project configuration

## Getting Started

### Prerequisites
- Java Development Kit (JDK) 8 or higher
- Apache Ant
- NetBeans IDE (recommended)
- MySQL (for database)

### Setup
1. Clone the repository:
   ```
   git clone https://github.com/NisalSandaru/Wristora.git
   ```
2. Open the project in NetBeans IDE.
3. Configure the database connection in `src/java/hibernate.cfg.xml`.
4. Build the project using NetBeans or by running:
   ```
   ant clean; ant build
   ```
5. Deploy the application to your preferred Java EE server (e.g., GlassFish).

## Features
- User sign-up, sign-in, and account verification
- Hibernate ORM integration
- Email notifications
- Session management
- Admin dashboard with left sidebar navigation (`web/admingDash.html`)
- Product management: add, edit, and delete products

## Folder Details
- `src/java/controller/` - Servlets and controllers
- `src/java/hibernate/` - Hibernate utility and entity classes
- `src/java/model/` - Utility and filter classes
- `web/assets/css/` - Stylesheets
- `web/assets/js/` - JavaScript files
- `web/assets/img/` - Images
- `web/admingDash.html` - Admin dashboard HTML file

## License
This project is licensed under the MIT License.

## Author
Nisal Sandaru
