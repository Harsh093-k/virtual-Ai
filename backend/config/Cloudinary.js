import {v2 as cloudinary} from "cloudinary";
import fs from "fs"
const uploadOnCloudinary=async(filePath)=>{
 cloudinary.config({
    cloud_name:"dnx2g5kyy",
    api_key:"584975954718597",
    api_secret:"vZ4q-iSBHmq-CjFBa_DOGoRFyNU"
 });
 try{
    const uploadResult = await cloudinary.uploader.upload(filePath)
    fs.unlinkSync(filePath);
    return uploadResult.secure_url
 }catch(error){
    fs.unlinkSync(filePath)
    return resizeBy.status(200).json({message:"cloudinary error"})
 }
}

export default uploadOnCloudinary