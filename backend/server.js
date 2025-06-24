import express from "express";
import mongoose  from "mongoose";
import cors    from "cors";
import authRoute  from "./routes/auth.js";
import userRoute from "./routes/User.js";
const app = express();
import cookieParser from 'cookie-parser';
import geminiResponse from "./gemini.js";



mongoose.connect("mongodb+srv://virtual:virtualai@cluster0.fbo5jtg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Then route definitions

app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRoute);
app.use("/api/userinfo", userRoute);
app.get("/",async(req,res)=>{
  let prompt=req.query.prompt;
  const data=await geminiResponse(prompt);
  res.json(data);
})

app.listen(8080, () => {
  console.log("Server is started on port 8080");
});
