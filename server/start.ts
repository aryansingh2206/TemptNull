// server/start.ts
import { createServer } from "./index.ts";

const PORT = 8000;
const app = createServer();

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
