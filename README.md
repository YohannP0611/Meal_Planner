
# 🥗 Meal Planner

**Authors:** Matthieu Sirier – Yohann Pouillieute – Valentin Dubrulle  
**Supervisor:** Zsolt Szabo-Resch  
**Project type:** School Project – Web Application  

# :salad: Meal Planner

**Authors:** Matthieu Sirier – Yohann Pouillieute – Valentin Dubrulle  
**Supervisor:** Zsolt Szabo-Resch  
**Project type:** School Project – Web Application  
**Institution:** EFREI Paris  

---

## :book: Project Overview

**Meal Planner** is a web application designed to help users **save recipes**, **organize weekly meal plans**, and **manage ingredients** efficiently.  
It was developed as part of a class project to demonstrate database design, backend logic, and user interaction through a simple interface.

---

## :jigsaw: Main Features

### :bust_in_silhouette: Authentication (Account)
- User registration and login  
- Each account includes:
  - ID, email, password, display name  
- Users are linked to recipes through the **Connects** table  

### :fork_knife_plate: Recipes
- Each recipe includes:
  - Title, description, prep time, cook time, servings, difficulty, steps, illustration  
- Linked to ingredients through the **Needs** connector table  

### :carrot: Ingredients
- Contain:
  - Name, calories, nutritive properties (Fat, Carbs, Fibers, Protein, Salt, Sugar)  
- Connected to shops through the **Sells** connector table  

### :convenience_store: Shops
- Contain:
  - Name, type, address, opening times, about info, website, phone number  
- Linked to ingredients via **Sells**

---
﻿
```
# 🥗 Meal Planner

**Authors:** Matthieu Sirier – Yohann Pouillieute – Valentin Dubrulle  
**Supervisor:** Zsolt Szabo-Resch  
**Project type:** School Project – Web Application  
**Institution:** ESSCA x EFREI Paris  

---

## 📖 Project Overview

**Meal Planner** is a web application designed to help users **save recipes**, **organize weekly meal plans**, and **manage ingredients** efficiently.  
It was developed as part of a class project to demonstrate database design, backend logic, and user interaction through a simple interface.

---

## 🧩 Main Features

### 👤 Authentication (Account)
- User registration and login  
- Each account includes:
  - ID, email, password, display name  
- Users are linked to recipes through the **Connects** table  

### 🍽️ Recipes
- Each recipe includes:
  - Title, description, prep time, cook time, servings, difficulty, steps, illustration  
- Linked to ingredients through the **Needs** connector table  

### 🥕 Ingredients
- Contain:
  - Name, calories, nutritive properties (Fat, Carbs, Fibers, Protein, Salt, Sugar)  
- Connected to shops through the **Sells** connector table  

### 🏪 Shops
- Contain:
  - Name, type, address, opening times, about info, website, phone number  
- Linked to ingredients via **Sells**

---

## 🗄️ Database Structure

| Entity      | Description |
|--------------|-------------|
| **Account**  | Authentication and user profile |
| **Recipes**  | Recipes with all cooking details |
| **Ingredients** | Nutritional info and links to shops |
| **Shop**     | Shop details and ingredient availability |
| **Connects** | Link between Accounts and Recipes (meal date/type) |
| **Needs**    | Link between Recipes and Ingredients (quantity/unit) |
| **Sells**    | Link between Shops and Ingredients (stock/unit) |

---

## 🧠 Future Improvements
Planned features for later versions:
- 🛒 Dynamic shopping list  
- 🌱 Dietary filters (vegan, gluten-free, etc.)  
- ⭐ Recipe ratings and user comments  
- 📱 Responsive and more interactive UI  

---

## 🧰 Technologies
- **Languages:** SQL, HTML/CSS, JavaScript (to be extended)
- **Database:** Relational model designed with multiple connector tables
- **Tools:** Visual Paradigm, SQL editor, Git/GitHub

---

## 📁 Repository Structure

Meal_Planner/
├── .idea/ # IntelliJ project files
├── ProjectFiles/ # SQL scripts and database exports
├── ProjectPlan/ # Project report and diagram (ignored by Git)
├── README.md # This file
