const path = require("path");
const dotenv = require("dotenv");
const createServer = require("./src/server");

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "..", ".env"), override: false });

const app = createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
