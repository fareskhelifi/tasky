require('dotenv').config();
const createServer = require("./src/server");

const app = createServer();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
