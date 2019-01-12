import * as http from "http";
import * as dotenv from "dotenv";
import app from './app';

dotenv.config();

const port = process.env.PORT;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Express listening on http://localhost:${port}`);
});
