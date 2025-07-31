# Wristora

Wristora is a web application project. This repository contains the source code, configuration files, and resources for the Wristora application.

## Project Structure

- `src/` - Java source code and configuration files
- `web/` - Web resources (HTML, CSS, JS, images)
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
- Admin dashboard with left sidebar navigation
- Product management: add, edit, and delete products

## Folder Details
- `src/java/controller/` - Servlets and controllers
- `src/java/hibernate/` - Hibernate utility and entity classes
- `src/java/model/` - Utility and filter classes
- `web/assets/` - Static assets (CSS, JS, images, fonts)
- `web/admingDash.html` - Admin dashboard HTML file

## License
This project is licensed under the MIT License.

## Author
Nisal Sandaru
