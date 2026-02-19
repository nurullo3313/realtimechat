import mongoose from "mongoose" 
import dotenv from "dotenv"
const myEnv = {};
dotenv.config({ processEnv: myEnv });
export const connectDB = async ()=>{
    try {
          await mongoose.connect("mongodb://localhost:27017/chat")
        console.log("MongoDB подключена успешно")
        
    } catch (error) {
      
        console.log(error);
         process.exit(1);
         
    }
}