-- Migration to increase Illustration column size in Recipes table
-- This allows storing longer filenames with timestamps (e.g., 1764291064047-image.jpg)

USE meal_planner;

ALTER TABLE Recipes 
  MODIFY COLUMN Illustration VARCHAR(255) NULL;
