import express from "express";

import { askToAssistant, getCurrentUser, updateAssistant } from "../controller/Users.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js"

const route = express.Router();

route.get("/getuser",isAuthenticated, getCurrentUser);
route.post("/updateUser",isAuthenticated,upload.single("assistantImage"), updateAssistant);
route.post("/ask",isAuthenticated,askToAssistant);
export default route;
