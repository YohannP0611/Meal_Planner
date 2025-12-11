-- =========================================
-- Meal Planner — Sample Test Data
-- =========================================

USE meal_planner;

SET FOREIGN_KEY_CHECKS = 0;

-- Optional: clear existing data
TRUNCATE TABLE `UserRecipePreferences`;
TRUNCATE TABLE `UserIngredientPreferences`;
TRUNCATE TABLE `Connects`;
TRUNCATE TABLE `Needs`;
TRUNCATE TABLE `Sells`;
TRUNCATE TABLE `Account`;
TRUNCATE TABLE `Recipes`;
TRUNCATE TABLE `Ingredients`;
TRUNCATE TABLE `Shop`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============ SHOPS ============

INSERT INTO `Shop` (IDShop, ShopName, Type, Adress, OpenTime, About, Website, Telephone)
VALUES
(1, 'Fresh Market',       'Supermarket',    '1 Main Street, Cityville',      'Mon-Sat 08:00-20:00', 'Local fresh produce', 'https://freshmarket.example',     '+33 1 23 45 67 01'),
(2, 'Bio & Co',           'Organic Store',  '22 Green Avenue, Cityville',    'Mon-Sat 09:00-19:00', 'Organic & bio',       'https://bioandco.example',       '+33 1 23 45 67 02'),
(3, 'FitFood Online',     'Online',         'Online only',                   '24/7',                'Healthy delivery',    'https://fitfood.example',        '+33 1 23 45 67 03'),
(4, 'Grandma''s Grocery', 'Corner Shop',    '5 Old Town Road, Cityville',    'Mon-Sun 07:30-21:00', 'Everything you need', 'https://grandmasgrocery.example','+33 1 23 45 67 04');

-- ============ INGREDIENTS ============

INSERT INTO `Ingredients`
  (IDIngredients, Name, Properties, Calories, Fat, Carbs, Fibers, Protein, Salt, Sugar, IngredientPicture)
VALUES
(1,  'Tomato',         'Fresh',   18,  0.20, 3.90, 1.20, 0.90, 0.01, 2.60, 'Tomato.jpg'),
(2,  'Pasta',          'Dry',    350,  1.50,72.00, 2.50,12.00, 0.00, 3.20, 'Pasta.jpg'),
(3,  'Olive Oil',      'Extra',  884,100.00, 0.00, 0.00, 0.00, 0.00, 0.00, 'Olive Oil.jpg'),
(4,  'Garlic',         'Fresh',  149,  0.50,33.00, 2.10, 6.40, 0.02, 1.00, 'Garlic.jpg'),
(5,  'Onion',          'Fresh',   40,  0.10, 9.30, 1.70, 1.10, 0.00, 4.20, 'Onion.jpg'),
(6,  'Chicken Breast', 'Lean',  165,  3.60, 0.00, 0.00,31.00, 0.10, 0.00, 'Chicken Breast.jpg'),
(7,  'Rice',           'White', 130,  0.30,28.00, 0.40, 2.70, 0.00, 0.10, 'Rice.jpg'),
(8,  'Lettuce',        'Fresh',  15,  0.20, 2.90, 1.30, 1.40, 0.02, 0.80, 'Lettuce.jpg'),
(9,  'Cucumber',       'Fresh',  16,  0.10, 3.60, 0.50, 0.70, 0.02, 1.70, 'Cucumber.jpg'),
(10, 'Egg',            'Free-range',155,11.00, 1.10, 0.00,13.00, 0.12, 1.10, 'Egg.jpg'),
(11, 'Bread',          'Wholegrain',250,3.50,45.00, 5.00, 9.00, 0.80, 5.00, 'Bread.jpg'),
(12, 'Cheese',         'Hard',  402,33.00, 1.30, 0.00,25.00, 1.80, 0.50, 'Cheese.jpg');

-- ============ RECIPES ============

INSERT INTO `Recipes`
  (IDRecipes, Title, Description, PrepTime, CookTime, Servings, Difficulty, Steps, Illustration)
VALUES
(1, 'Pasta al Pomodoro',
   'Simple Italian pasta with tomato sauce.',
   '00:10:00', '00:15:00', 2, 'easy',
   '1. Boil pasta until al dente.\n2. Sauté garlic and onion in olive oil.\n3. Add tomatoes and simmer.\n4. Mix pasta with sauce and serve.',
   'Pasta Al Pomodoro.jpg'),

(2, 'Chicken & Rice Bowl',
   'Balanced bowl with grilled chicken, rice and veggies.',
   '00:15:00', '00:20:00', 2, 'medium',
   '1. Cook rice.\n2. Season and grill chicken.\n3. Sauté vegetables.\n4. Assemble bowl and serve.',
   'Chicken Rice & Bowl.jpg'),

(3, 'Green Salad',
   'Fresh salad with lettuce, tomato and cucumber.',
   '00:05:00', '00:00:00', 1, 'easy',
   '1. Wash and chop vegetables.\n2. Mix in a bowl.\n3. Add dressing and toss.',
   'Green Salad.jpg'),

(4, 'Cheese Omelette',
   'Fluffy cheese omelette for breakfast.',
   '00:05:00', '00:05:00', 1, 'easy',
   '1. Beat eggs with salt.\n2. Pour into hot pan.\n3. Add cheese.\n4. Fold and serve.',
   'Cheese Omelette.jpg'),

(5, 'Garlic Bread',
   'Toasted bread with garlic and olive oil.',
   '00:05:00', '00:10:00', 3, 'easy',
   '1. Mix olive oil with minced garlic.\n2. Spread on bread slices.\n3. Toast until golden.',
   'Garlic Bread.jpg');

-- ============ ACCOUNTS ============

INSERT INTO `Account` (IDAcc, Email, Password, DisplayName)
VALUES
(1, 'alice@example.com',   '$2b$10$alicehashpassword.....................', 'Alice'),
(2, 'bob@example.com',     '$2b$10$bobhashpassword.......................',   'Bob'),
(3, 'charlie@example.com', '$2b$10$charliehashpassword...................', 'Charlie');

-- For a real app you’d store real bcrypt hashes; here they’re placeholders.

-- ============ SELLS (Shop <-> Ingredients) ============

INSERT INTO `Sells` (IDShop, IDIngredients, Stock, StockUnit)
VALUES
(1, 1, 50.00,  'pcs'),   -- Fresh Market sells Tomato
(1, 2, 100.00, 'packs'), -- Fresh Market sells Pasta
(1, 3, 40.00,  'bottles'),
(1, 5, 60.00,  'pcs'),
(2, 1, 30.00,  'pcs'),   -- Bio & Co sells Tomato
(2, 8, 25.00,  'heads'), -- Lettuce
(2, 9, 40.00,  'pcs'),   -- Cucumber
(2, 11, 20.00, 'loaves'),
(3, 6, 80.00,  'packs'), -- FitFood Online sells Chicken
(3, 7, 90.00,  'packs'), -- Rice
(3, 10, 200.00,'pcs'),   -- Eggs
(4, 1, 20.00,  'pcs'),   -- Grandma's Grocery
(4, 2, 40.00,  'packs'),
(4, 11, 30.00, 'loaves'),
(4, 12, 15.00, 'blocks');

-- ============ NEEDS (Recipes <-> Ingredients) ============

-- Recipe 1: Pasta al Pomodoro
INSERT INTO `Needs` (IDRecipes, IDIngredients, Quantity, Unit)
VALUES
(1, 2, 180.00, 'g'),    -- Pasta
(1, 1, 2.00,   'pcs'),  -- Tomato
(1, 3, 1.00,   'tbsp'), -- Olive Oil
(1, 4, 2.00,   'cloves'),
(1, 5, 0.50,   'pcs');

-- Recipe 2: Chicken & Rice Bowl
INSERT INTO `Needs` (IDRecipes, IDIngredients, Quantity, Unit)
VALUES
(2, 6, 250.00, 'g'),    -- Chicken Breast
(2, 7, 150.00, 'g'),    -- Rice
(2, 1, 1.00,   'pcs'),  -- Tomato
(2, 9, 0.50,   'pcs');  -- Cucumber

-- Recipe 3: Green Salad
INSERT INTO `Needs` (IDRecipes, IDIngredients, Quantity, Unit)
VALUES
(3, 8, 0.50,   'head'), -- Lettuce
(3, 1, 1.00,   'pcs'),  -- Tomato
(3, 9, 0.50,   'pcs');  -- Cucumber

-- Recipe 4: Cheese Omelette
INSERT INTO `Needs` (IDRecipes, IDIngredients, Quantity, Unit)
VALUES
(4, 10, 2.00,  'pcs'),  -- Eggs
(4, 12, 30.00, 'g'),    -- Cheese
(4, 3, 1.00,   'tsp');  -- Olive Oil

-- Recipe 5: Garlic Bread
INSERT INTO `Needs` (IDRecipes, IDIngredients, Quantity, Unit)
VALUES
(5, 11, 4.00,  'slices'), -- Bread
(5, 4, 2.00,   'cloves'), -- Garlic
(5, 3, 1.50,   'tbsp');   -- Olive Oil

-- ============ CONNECTS (Account <-> Recipes as Meals) ============

INSERT INTO `Connects` (IDRecipes, IDAcc, DateMeal, MealType)
VALUES
(1, 1, '2025-11-18', 'dinner'),    -- Alice ate Pasta al Pomodoro
(3, 1, '2025-11-19', 'lunch'),     -- Alice ate Green Salad
(4, 1, '2025-11-19', 'breakfast'), -- Alice ate Cheese Omelette

(2, 2, '2025-11-18', 'lunch'),     -- Bob ate Chicken & Rice Bowl
(5, 2, '2025-11-18', 'dinner'),    -- Bob ate Garlic Bread

(3, 3, '2025-11-17', 'dinner'),    -- Charlie ate Green Salad
(1, 3, '2025-11-19', 'lunch');     -- Charlie ate Pasta al Pomodoro

-- ============ USER PREFERENCES ============

-- Alice's preferences
INSERT INTO `UserRecipePreferences` (IDAcc, IDRecipes, Status)
VALUES
(1, 1, 'liked'),   -- Alice likes Pasta al Pomodoro
(1, 3, 'liked'),   -- Alice likes Green Salad
(1, 2, 'passed');  -- Alice passed Chicken & Rice Bowl

INSERT INTO `UserIngredientPreferences` (IDAcc, IDIngredients, Status)
VALUES
(1, 1, 'liked'),   -- Alice likes Tomato
(1, 8, 'liked'),   -- Alice likes Lettuce
(1, 6, 'passed');  -- Alice passed Chicken Breast

-- Bob's preferences
INSERT INTO `UserRecipePreferences` (IDAcc, IDRecipes, Status)
VALUES
(2, 2, 'liked'),   -- Bob likes Chicken & Rice Bowl
(2, 5, 'liked');   -- Bob likes Garlic Bread

INSERT INTO `UserIngredientPreferences` (IDAcc, IDIngredients, Status)
VALUES
(2, 6, 'liked'),   -- Bob likes Chicken Breast
(2, 7, 'liked');   -- Bob likes Rice