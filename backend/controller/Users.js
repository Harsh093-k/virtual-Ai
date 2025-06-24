import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../model/user.js";
import cloudinary from "cloudinary";
import moment from "moment/moment.js";
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.id;
    console.log("User ID from token:", userId);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (err) {
    console.error("Error in getCurrentUser:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage = ""; // switched to let

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const userId = req.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { assistantImage, assistantName },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateAssistant:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const askToAssistant=async(req,res)=>{
  try{
    const {command}=req.body;
     const user=await User.findById(req.id);
     const userName=user.name;
     const assistantName=user.assistantName;

    const result=await geminiResponse(command,assistantName,userName)
    const jsonMatch=result.match(/{[\s\S]*}/);
    if(!jsonMatch){
      return res.status(400).json({response:"sorry ,I cannot understand"})
    }
    const gemResult=JSON.parse(jsonMatch[0]);
    const type=gemResult.type
    switch(type){
      case "get-date" : return res.json({
        type,
        userInput:gemResult.userInput,
        response:`current date is ${moment().format("YYYY-MM-DD")} `
      }) ;
       case "get-time" : return res.json({
        type,
        userInput:gemResult.userInput,
        response:`current time is ${moment().format("hh:mm A")} `
      }) ;
       case "get-day" : return res.json({
        type,
        userInput:gemResult.userInput,
        response:`current day is ${moment().format("dddd")} `
      }) ;
       case "get-month" : return res.json({
        type,
        userInput:gemResult.userInput,
        response:`current month is ${moment().format("MMMM")} `
      }) ;
      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
      case  "ms-word-open" :
      case "ms-excel-open":
      case "ms-powerpoint-open":
      case "whatsapp-open":
      case "open-setting":
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:gemResult.response,
        });
        default:
              return res.status(400).json({response:"sorry ,I cannot understand"})
       }
  }catch(error){
       return res.status(500).json({response:"ask assistant error"})
  }
}

