-- Migration: add image columns to Ingredients and Recipes tables
ALTER TABLE Ingredients
  ADD COLUMN IngredientPicture VARCHAR(255) NULL AFTER Sugar;

ALTER TABLE Recipes
  ADD COLUMN RecipePicture VARCHAR(255) NULL AFTER Illustration;
