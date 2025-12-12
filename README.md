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
    title Meal Planner – Final Gantt (UML → Implementation)
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    todayMarker off

    section Project setup
    Repo init + structure + README base (Yohann)                     :done, s1, 2025-09-25, 2d
    Vue project initialization (Matthieu)                            :done, s2, 2025-10-17, 2d
    Front/Back skeleton + base index.html (Valentin)                 :done, s3, 2025-10-17, 2d
    Repository re-organization + README cleanup (Yohann)             :done, s4, 2025-10-17, 2d

    section UML / Documentation
    Initial use cases + planned Gantt in report (Matthieu)           :done, u1, 2025-10-31, 2d
    Upload UML package + diagrams (Valentin)                         :done, u2, 2025-11-20, 2d
    Roadmap Gantt added to README (Valentin)                         :done, u3, 2025-11-20, 1d
    README updates (Yohann)                                          :done, u4, 2025-11-20, 1d
    Replace latest PDF report version (Yohann & Valentin)            :done, u5, 2025-11-28, 1d
    Documentation refresh / file uploads (Yohann & Valentin)         :done, u6, 2025-12-05, 1d

    section Mock data & early web integration
    Fake JSON data + integration in website (Matthieu)               :done, m1, 2025-10-31, 3d
    Add JSON server for mock API + data handling (Matthieu)          :done, m2, 2025-11-21, 2d

    section Backend foundation
    Backend development started (Matthieu)                           :done, b1, 2025-11-19, 2d
    Fix run-blocking lines + merge preparation (Matthieu)            :done, b2, 2025-11-27, 2d
    Merge branches (backend/develop) (Matthieu)                      :done, b3, 2025-11-27, 1d
    Move DB config to .env (Yohann & Valentin)                       :done, b4, 2025-11-28, 1d

    section Shops / Navigation / UI
    Shops page + CSS layout improvements (Yohann & Valentin)         :done, ui1, 2025-11-28, 2d
    Navbar improvements (Yohann & Valentin)                          :done, ui2, 2025-11-28, 1d
    ShoppingList view + Home fixes (Yohann & Valentin)               :done, ui3, 2025-11-28, 2d
    Recipes UI rework to match wireframe (Yohann & Valentin)         :done, ui4, 2025-11-28, 2d
    Home responsiveness + login view prep (Yohann & Valentin)        :done, ui5, 2025-11-29, 2d

    section Image upload & forms
    Ingredient image upload + management update (Matthieu)           :done, img1, 2025-11-28, 2d
    RecipeForm component + validation/logging (Matthieu)             :done, img2, 2025-11-28, 2d
    Multiple image uploads + form enhancements (Matthieu)            :done, img3, 2025-11-28, 2d
    Cleanup unused images + schema update (Matthieu)                 :done, img4, 2025-11-28, 1d

    section Authentication & security
    JWT authentication + register/login routes + LoginPopup (Matthieu) :done, a1, 2025-12-05, 3d
    Role-based access control (Matthieu)                             :done, a2, 2025-12-11, 2d

    section Preferences (business logic)
    Preferences tables + localStorage refactor (Matthieu)            :done, p1, 2025-12-10, 2d
    Preferences routes/services + UI sync (Matthieu)                 :done, p2, 2025-12-11, 1d
    General improvements / refactoring (Yohann & Valentin)           :done, p3, 2025-12-11, 1d

    section Meal planning (Connects / Meals)
    Planning routes (connects + meals) backend (Yohann & Valentin)   :done, plan1, 2025-12-11, 1d
    Meals API endpoint + frontend integration (Matthieu)             :done, plan2, 2025-12-12, 1d
    Planning modal styling & structure (Matthieu)                    :done, plan3, 2025-12-12, 1d
    Planning UX polish + QA (Yohann & Valentin)                  :done, planX, 2025-12-12, 1d


    section Integration & QA
    Frontend ↔ Backend integration tests (Yohann & Valentin)     :done, qa1, 2025-12-06, 2d
    Bugfixes + regression testing (Yohann & Valentin)            :done, qa2, 2025-12-09, 2d
