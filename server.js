import app from "./src/app.js"
import connectToDB from "./src/config/database.js"
import "dotenv/config";
const PORT = process.env.PORT || 8080
connectToDB();


app.listen(PORT,()=>{console.log("server is runnig on port 3000")})