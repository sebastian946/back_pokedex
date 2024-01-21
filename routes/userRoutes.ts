import express, { Request, Response } from "express";
import { UserInfo } from "os";
import IUserModel from "../models/userModel"
import userModel from "../models/userModel";
import user, { IUser} from "../models/userModel";
const router = express.Router();

const Login= (validate: boolean) =>{

}

router.post("/register", async (req: Request, res: Response) => {
    try {
        const { userName, name, lastname, email, password } = req.body;
        
        const validateEmail = user.findOne({email});
        if(await validateEmail){
            res.status(405).json({message: "The email is now registeres"});
        }else{
            const newUser: IUser = new user({ userName, name, lastname, email, password });
            await newUser.save();
            res.status(200).json({ message: "The user register succesfull:", newUser });
        }
        
    } catch (error) {
        res.status(500).json({ message: "The error in register user is:", error });
    }
});

router.get("/getUser", async (req: Request, res: Response)=>{
    try{
        const userInfo = await user.find();
        res.status(200).json(userInfo);
    }catch(error){
        res.status(500).json({message: "Something gone wrong", error});
    }
});

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userFind:IUser | null = await user.findOne({ email });
        let validateLogin = false;
        console.log(userFind);
        if (!userFind) {
            return res.status(400).json({ message: "The system didnt found the user", validateLogin });
        }
        if (userFind) {
            const passwordCompare = await userFind.comparePassword(password);
            console.log(passwordCompare);
            if (!passwordCompare) {
                console.log("The password dont match");
                return res.status(401).json({ message: "The password dont match",validateLogin });
            }
        } else {
            console.log("Dont found the user");
        }
        validateLogin = true;
        res.status(200).json({ message: "Login successfull", validateLogin, userFind });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "The login have the errors ", error });
    }
});

export default router;