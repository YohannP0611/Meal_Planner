# Meal Planner

**Authors:** Matthieu Sirier, Yohann Pouillieute, Valentin Dubrulle  
**Supervisor:** Zsolt Szabo-Resch  
**Institution:** ESSCA x EFREI Paris  
**Project Type:** Academic Web Application Project  

---

## Overview

Meal Planner is a web application developed as part of a school project.  
Its purpose is to help users store their recipes, organize them into weekly meal plans, and manage the relationships between ingredients, recipes, and shops.  
The project focuses on database modeling, entity relationships, and a simple interface for demonstration purposes.

---

## Features

### Authentication
- User registration and login system.  
- Each account includes an ID, email, password, and display name.  
- Accounts are linked to recipes through the **Connects** relationship.

### Recipes
- Each recipe includes a title, description, preparation time, cooking time, servings, difficulty level, steps, and an illustration.  
- Recipes are connected to ingredients through the **Needs** relationship.

### Ingredients
- Each ingredient includes a name, calorie value, and nutritional properties (fat, carbohydrates, fiber, protein, salt, sugar).  

### Shops
- Ingredients are connected to shops through the **Sells** relationship.
- Each shop includes a name, type, address, opening hours, description, website, and phone number.  
- Shops are linked to ingredients via **Sells**.

---

## Database Structure

| Entity        | Description |
|----------------|-------------|
| **Account**    | Stores authentication and user profile information |
| **Recipes**    | Contains detailed recipe information |
| **Ingredients**| Includes ingredient data and nutritional properties |
| **Shop**       | Represents stores where ingredients are available |
| **Connects**   | Links Accounts and Recipes (meal type and date) |
| **Needs**      | Links Recipes and Ingredients (quantity and unit) |
| **Sells**      | Links Shops and Ingredients (stock and unit) |


---

## Technologies Used

- **Languages:** SQL, HTML, CSS, JavaScript (to be extended)  
- **Database:** Relational database model using connector tables  
- **Tools:** Visual Paradigm, SQL editor, Git, GitHub  

---

## Repository Structure

Meal_Planner/

├── .idea/ # Project configuration files

├── ProjectFiles/ # SQL scripts and database exports

├── ProjectPlan/ # Project report and diagrams (ignored by Git)

├── README.md # Project documentation
