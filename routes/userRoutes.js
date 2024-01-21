"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userModel_1 = __importDefault(require("../models/userModel"));
const router = express_1.default.Router();
const Login = (validate) => {
};
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, name, lastname, email, password } = req.body;
        const validateEmail = userModel_1.default.findOne({ email });
        if (yield validateEmail) {
            res.status(405).json({ message: "The email is now registeres" });
        }
        else {
            const newUser = new userModel_1.default({ userName, name, lastname, email, password });
            yield newUser.save();
            res.status(200).json({ message: "The user register succesfull:", newUser });
        }
    }
    catch (error) {
        res.status(500).json({ message: "The error in register user is:", error });
    }
}));
router.get("/getUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield userModel_1.default.find();
        res.status(200).json(userInfo);
    }
    catch (error) {
        res.status(500).json({ message: "Something gone wrong", error });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userFind = yield userModel_1.default.findOne({ email });
        let validateLogin = false;
        console.log(userFind);
        if (!userFind) {
            return res.status(400).json({ message: "The system didnt found the user", validateLogin });
        }
        if (userFind) {
            const passwordCompare = yield userFind.comparePassword(password);
            console.log(passwordCompare);
            if (!passwordCompare) {
                console.log("The password dont match");
                return res.status(401).json({ message: "The password dont match", validateLogin });
            }
        }
        else {
            console.log("Dont found the user");
        }
        validateLogin = true;
        res.status(200).json({ message: "Login successfull", validateLogin, userFind });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "The login have the errors ", error });
    }
}));
exports.default = router;
