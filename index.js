const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

// Start the server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Server listening at ${port}`);
