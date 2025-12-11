const bcrypt = require('bcrypt');

const password = 'admin123'; // Change this to your desired password
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('\n==============================================');
  console.log('ADMIN PASSWORD HASH GENERATED');
  console.log('==============================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nReplace the admin password in TestData.sql with this hash');
  console.log('==============================================\n');
});
