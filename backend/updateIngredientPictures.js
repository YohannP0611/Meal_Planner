require("dotenv").config();
const db = require("./models/db");

const updates = [
  ['http://localhost:3000/uploads/Bread.jpg', 'le pain'],
  ['http://localhost:3000/uploads/Cheese.jpg', 'le fromage'],
  ['http://localhost:3000/uploads/Chicken%20Breast.jpg', 'le poulet'],
  ['http://localhost:3000/uploads/Cucumber.jpg', 'le concombre'],
  ['http://localhost:3000/uploads/Egg.jpg', "l'oeuf"],
  ['http://localhost:3000/uploads/Garlic.jpg', "l'ail"],
  ['http://localhost:3000/uploads/Green%20Salad.jpg', 'la salade verte'],
  ['http://localhost:3000/uploads/Lettuce.jpg', 'la laitue'],
  ['http://localhost:3000/uploads/Olive%20Oil.jpg', "l'huile d'olive"],
  ['http://localhost:3000/uploads/Onion.jpg', "l'oignon"],
  ['http://localhost:3000/uploads/Pasta.jpg', 'les pates'],
  ['http://localhost:3000/uploads/Rice.jpg', 'le riz'],
  ['http://localhost:3000/uploads/Tomato.jpg', 'la tomate']
];

let done = 0;

updates.forEach(([url, name]) => {
  db.query(
    'UPDATE Ingredients SET IngredientPicture = ? WHERE Name = ?',
    [url, name],
    (err) => {
      if (err) {
        console.error('Error for ' + name + ':', err.message);
      } else {
        console.log('Updated:', name);
      }
      done++;
      if (done === updates.length) {
        console.log('All ingredients updated');
        process.exit(0);
      }
    }
  );
});
