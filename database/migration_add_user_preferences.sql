-- =========================================
-- Migration: Add User Preferences Tables
-- Description: Add tables to store user likes/pass for recipes and ingredients
-- Date: December 11, 2025
-- =========================================

USE meal_planner;

-- Create UserRecipePreferences table
CREATE TABLE IF NOT EXISTS `UserRecipePreferences` (
  `IDAcc`      INT UNSIGNED NOT NULL,
  `IDRecipes`  INT UNSIGNED NOT NULL,
  `Status`     ENUM('liked', 'passed') NOT NULL,
  `CreatedAt`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`IDAcc`, `IDRecipes`),
  CONSTRAINT `fk_userrecipepref_account`
    FOREIGN KEY (`IDAcc`) REFERENCES `Account` (`IDAcc`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_userrecipepref_recipes`
    FOREIGN KEY (`IDRecipes`) REFERENCES `Recipes` (`IDRecipes`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create UserIngredientPreferences table
CREATE TABLE IF NOT EXISTS `UserIngredientPreferences` (
  `IDAcc`          INT UNSIGNED NOT NULL,
  `IDIngredients`  INT UNSIGNED NOT NULL,
  `Status`         ENUM('liked', 'passed') NOT NULL,
  `CreatedAt`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt`      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`IDAcc`, `IDIngredients`),
  CONSTRAINT `fk_useringredientpref_account`
    FOREIGN KEY (`IDAcc`) REFERENCES `Account` (`IDAcc`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_useringredientpref_ingredients`
    FOREIGN KEY (`IDIngredients`) REFERENCES `Ingredients` (`IDIngredients`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add indexes for better query performance
CREATE INDEX idx_userrecipepref_status ON `UserRecipePreferences` (`Status`);
CREATE INDEX idx_useringredientpref_status ON `UserIngredientPreferences` (`Status`);

