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

├── README.md # Project documentation


```mermaid
gantt
    dateFormat  YYYY-MM-DD
    title       Meal Planner – Project Roadmap

    section Analysis & Design
    Concept definition and user stories           :done, concept, 2025-08-29, 7d
    Data model and UML diagrams                   :done, uml, 2025-09-05, 21d

    section Database & Backend Setup
    SQL schema (tables + seed)                    :db_schema, 2025-09-26, 21d

    section Course Checkpoints
    Checkpoint OCT17 (repo + diagrams + SQL + basic Vue)   :crit, cp_oct17, 2025-10-17, 1d
    Checkpoint OCT31 (3 list pages frontend)               :crit, cp_oct31, 2025-10-31, 1d
    Checkpoint NOV21 (fully working frontend)              :crit, cp_nov21, 2025-11-21, 1d
    Checkpoint NOV28 (serverside list controllers)         :crit, cp_nov28, 2025-11-28, 1d
    Checkpoint DEC05 (full serverside CRUD)                :crit, cp_dec05, 2025-12-05, 1d
    Final demo DEC12                                       :crit, cp_dec12, 2025-12-12, 1d

    section Frontend Development
    Frontend setup (framework + routing)          :front_setup, 2025-10-10, 7d
    List pages (recipes, ingredients, shops)      :front_lists, 2025-10-17, 14d
    CRUD UI for recipes and ingredients           :front_crud, 2025-10-31, 21d
    Authentication UI                             :front_auth, 2025-11-21, 7d
    Responsive design and cleanup                 :front_polish, 2025-12-05, 7d

    section Backend Development
    API CRUD for recipes and ingredients          :api_crud_main, 2025-11-10, 21d
    API for meal planning (Connects)              :api_planning, 2025-11-24, 14d
    Serverside list controllers                   :api_lists, 2025-12-08, 7d
    Full serverside CRUD controllers              :api_crud_full, 2025-12-15, 7d
    Backend buffer (fixes + refactoring)          :api_buffer, 2025-12-22, 7d

    section Documentation & Quality
    Tests (frontend + backend)                    :tests_all, 2025-11-21, 14d
    Technical documentation PDF                   :doc_tech, 2025-11-28, 14d
    User documentation + README                   :doc_user, 2025-12-01, 11d

    section Future Features
    Weekly auto-generated shopping list           :future_list, 2025-12-15, 14d
    Diet filters                                  :future_filters, 2025-12-29, 14d
    Recipe rating and comments                    :future_rating, 2026-01-12, 14d
    Recommendation system                         :future_reco, 2026-01-26, 21d

