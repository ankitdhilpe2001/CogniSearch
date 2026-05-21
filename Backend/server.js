import app from "./src/app.js"
import connectToDB from "./src/config/database.js"
import "dotenv/config";
const PORT = process.env.PORT || 8080
connectToDB();

import { aiModel } from "./src/services/AIChat.service.js";

const response = await aiModel.invoke("What is the meaning of the AI in 100 wordsc ?")
console.log(response.content)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});