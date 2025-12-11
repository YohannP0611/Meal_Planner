-- =========================================
-- Meal Planner — DUBRULLE/SIRIER/POUILLIEUTE
-- Table: Shops, Ingredients, Recipes, Account
-- Connectors: Sells, Needs, Connects
-- =========================================

CREATE DATABASE IF NOT EXISTS meal_planner
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;
USE meal_planner;

-- Drop in dependency order
DROP TABLE IF EXISTS `UserRecipePreferences`;
DROP TABLE IF EXISTS `UserIngredientPreferences`;
DROP TABLE IF EXISTS `Connects`;
DROP TABLE IF EXISTS `Needs`;
DROP TABLE IF EXISTS `Sells`;
DROP TABLE IF EXISTS `Account`;
DROP TABLE IF EXISTS `Recipes`;
DROP TABLE IF EXISTS `Ingredients`;
DROP TABLE IF EXISTS `Shop`;

-- ============ ENTITIES ============

CREATE TABLE `Shop` (
  `IDShop`    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `ShopName`  VARCHAR(50)  NOT NULL,
  `Type`      VARCHAR(50)  NOT NULL,
  `Adress`    VARCHAR(100) NOT NULL,
  `OpenTime`  VARCHAR(50),
  `About`     VARCHAR(50),
  `Website`   VARCHAR(50),
  `Telephone` VARCHAR(50),
  PRIMARY KEY (`IDShop`),
  UNIQUE KEY `uq_shop_name_adress` (`ShopName`, `Adress`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Ingredients` (
  `IDIngredients` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Name`          VARCHAR(50) NOT NULL,
  `Properties`    VARCHAR(50),
  `Calories`      INT,
  `Fat`           DECIMAL(15,2),
  `Carbs`         DECIMAL(15,2),
  `Fibers`        DECIMAL(15,2),
  `Protein`       DECIMAL(15,2),
  `Salt`          DECIMAL(15,2),
  `Sugar`         DECIMAL(15,2),
  `IngredientPicture` VARCHAR(255),
  PRIMARY KEY (`IDIngredients`),
  UNIQUE KEY `uq_ingredients_name` (`Name`),
  CHECK (`Calories` IS NULL OR `Calories` >= 0),
  CHECK (`Fat`     IS NULL OR `Fat`     >= 0),
  CHECK (`Carbs`   IS NULL OR `Carbs`   >= 0),
  CHECK (`Fibers`  IS NULL OR `Fibers`  >= 0),
  CHECK (`Protein` IS NULL OR `Protein` >= 0),
  CHECK (`Salt`    IS NULL OR `Salt`    >= 0),
  CHECK (`Sugar`   IS NULL OR `Sugar`   >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Recipes` (
  `IDRecipes`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Title`       VARCHAR(50)  NOT NULL,
  `Description` TEXT,
  `PrepTime`    TIME         NOT NULL,
  `CookTime`    TIME         NOT NULL,
  `Servings`    INT          NOT NULL,
  `Difficulty`  ENUM('easy','medium','hard') NOT NULL DEFAULT 'easy',
  `Steps`       TEXT         NOT NULL,
  `Illustration` VARCHAR(255),
  PRIMARY KEY (`IDRecipes`),
  CHECK (`Servings` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Account` (
  `IDAcc`       INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `Email`       VARCHAR(50)  NOT NULL,
  `Password`    VARCHAR(60)  NOT NULL,
  `DisplayName` VARCHAR(50)  NOT NULL,
  PRIMARY KEY (`IDAcc`),
  UNIQUE KEY `uq_account_email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============ CONNECTORS ============

CREATE TABLE `Sells` (
  `IDShop`        INT UNSIGNED NOT NULL,
  `IDIngredients` INT UNSIGNED NOT NULL,
  `Stock`         DECIMAL(15,2) NOT NULL DEFAULT 0,
  `StockUnit`     VARCHAR(50)   NOT NULL,
  PRIMARY KEY (`IDShop`, `IDIngredients`),
  CONSTRAINT `fk_sells_shop`
    FOREIGN KEY (`IDShop`) REFERENCES `Shop` (`IDShop`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sells_ingredients`
    FOREIGN KEY (`IDIngredients`) REFERENCES `Ingredients` (`IDIngredients`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK (`Stock` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Needs` (
  `IDRecipes`     INT UNSIGNED NOT NULL,
  `IDIngredients` INT UNSIGNED NOT NULL,
  `Quantity`      DECIMAL(15,2) NOT NULL,
  `Unit`          VARCHAR(50)   NOT NULL,
  PRIMARY KEY (`IDRecipes`, `IDIngredients`),
  CONSTRAINT `fk_needs_recipes`
    FOREIGN KEY (`IDRecipes`) REFERENCES `Recipes` (`IDRecipes`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_needs_ingredients`
    FOREIGN KEY (`IDIngredients`) REFERENCES `Ingredients` (`IDIngredients`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CHECK (`Quantity` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Connects` (
  `IDRecipes` INT UNSIGNED NOT NULL,
  `IDAcc`     INT UNSIGNED NOT NULL,
  `DateMeal`  DATE         NOT NULL,
  `MealType`  ENUM('breakfast','lunch','dinner') NOT NULL,
  PRIMARY KEY (`IDRecipes`, `IDAcc`, `DateMeal`, `MealType`),
  CONSTRAINT `fk_connects_recipes`
    FOREIGN KEY (`IDRecipes`) REFERENCES `Recipes` (`IDRecipes`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_connects_account`
    FOREIGN KEY (`IDAcc`) REFERENCES `Account` (`IDAcc`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============ USER PREFERENCES ============

CREATE TABLE `UserRecipePreferences` (
  `IDAcc`      INT UNSIGNED NOT NULL,
  `IDRecipes`  INT UNSIGNED NOT NULL,
  `Status`     ENUM('liked', 'passed') NOT NULL,
  PRIMARY KEY (`IDAcc`, `IDRecipes`),
  CONSTRAINT `fk_userrecipepref_account`
    FOREIGN KEY (`IDAcc`) REFERENCES `Account` (`IDAcc`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_userrecipepref_recipes`
    FOREIGN KEY (`IDRecipes`) REFERENCES `Recipes` (`IDRecipes`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_userrecipepref_status (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `UserIngredientPreferences` (
  `IDAcc`          INT UNSIGNED NOT NULL,
  `IDIngredients`  INT UNSIGNED NOT NULL,
  `Status`         ENUM('liked', 'passed') NOT NULL,
  PRIMARY KEY (`IDAcc`, `IDIngredients`),
  CONSTRAINT `fk_useringredientpref_account`
    FOREIGN KEY (`IDAcc`) REFERENCES `Account` (`IDAcc`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_useringredientpref_ingredients`
    FOREIGN KEY (`IDIngredients`) REFERENCES `Ingredients` (`IDIngredients`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_useringredientpref_status (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
