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


gantt
    dateFormat  YYYY-MM-DD
    title       Projet OO / UML / Web – Planning Gantt

    section Initialisation du projet
    Choix des membres + sujet [Resp: ______]           :t1, 2025-09-01, 2025-09-12
    Liste des fonctionnalités (CRUD + extra) [Resp: ______] :t2, 2025-09-05, 2025-09-26

    section Base de données
    Diagramme ER + structure des tables [Resp: ______] :t3, 2025-09-08, 2025-09-26
    SQL complet (DROP/CREATE/INSERT) [Resp: ______]    :t4, 2025-09-15, 2025-09-26

    section GitHub & infrastructure
    Création repo GitHub + .gitignore + README [Resp: ______] :t5, 2025-09-26, 2025-10-03
    Ajout diagrammes + scripts SQL + commits [Resp: ______]   :t6, 2025-10-03, 2025-10-17

    section UML / Diagrams (1)
    Use cases + Gantt prévu [Resp: ______]             :t7, 2025-10-03, 2025-10-31
    Diagrammes activité + wireframes + séquence [Resp: ______] :t8, 2025-10-31, 2025-11-21

    section Frontend (Vue.js, fake JSON)
    Maquettage pages liste/détail/édition [Resp: ______]      :t9, 2025-10-10, 2025-10-24
    Frontend liste + datasheet + editor (fake JSON) [Resp: ______] :t10, 2025-10-24, 2025-10-31
    Frontend complet (toutes fonctions CRUD en fake JSON) [Resp: ______] :t11, 2025-10-31, 2025-11-21

    section Backend (Express.js) & API
    Setup Express.js + middlewares + MVC [Resp: ______] :t12, 2025-10-31, 2025-11-14
    Contrôleurs liste côté serveur [Resp: ______]       :t13, 2025-11-14, 2025-11-28
    Contrôleurs CRUD complets + tests basiques [Resp: ______] :t14, 2025-11-28, 2025-12-05
    Connexion frontend ↔ API (Axios/Fetch) [Resp: ______]     :t15, 2025-11-21, 2025-12-05

    section UML / Diagrams (2) + doc
    Diagrammes composant + classe [Resp: ______]        :t16, 2025-11-21, 2025-11-28
    Correction des diagrammes selon implémentation réelle [Resp: ______] :t17, 2025-11-28, 2025-12-05
    Documentation finale (tous diagrammes + description) [Resp: ______] :t18, 2025-12-01, 2025-12-12

    section Finalisation
    Ajout logique métier avancée (non-CRUD) [Resp: ______]    :t19, 2025-11-28, 2025-12-12
    Préparation démo + répétition [Resp: ______]              :t20, 2025-12-05, 2025-12-12

├── .idea/ # Project configuration files

├── ProjectFiles/ # SQL scripts and database exports

├── README.md # Project documentation
