import express from "express";
import { login, logout, Signup } from "../controller/auth.js";

const route = express.Router();

route.post("/signup", Signup);
route.post("/login", login);
route.post("/logout", logout);
export default route;



