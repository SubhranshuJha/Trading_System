import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import blackListToken from "../models/blackListToken.model.js";
import generateToken from "../utils/generateToken.js";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerUser = async (req, res) => {
    
    try {

        const { email , name , password } = req.body;

        if ( !email || !name || !password ) {
            return res.status(400).json ( {
                success: false,
                message: "user registration failed ! All fields are required."
            })
        }

        if ( name.length < 3 ) {
            return res.status(400).json ( {
                success: false,
                message: "user registration failed ! Name must be at least 3 characters long."
            })
        }

        if ( !passwordRegex.test(password) ) {
            return res.status(400).json ( {
                success: false,
                message: "user registration failed ! Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            })
        }

        const existingUser = await userModel.findOne({email}) ;
        if ( existingUser ) {
            return res.status(400).json ( {
                success: false,
                message: "user registration failed ! Email already exists."
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = new userModel ( { email, name, password: hashedPassword } );
        await userData.save();

        return res.status(201).json ( {
            success: true,
            message: "user registered successfully."
        })

    } catch (error) {
        console.log("ISE > REG USER FAILED DUE TO EXCEPTION ");
        return res.status(500).json ( {
            success: false,
            message: "user registration failed ! Something went wrong."
        })
    }

}

const loginUser = async (req, res) => {

    try {
        
        const { email , password } = req.body;
        if ( !email || !password ) {
            return res.status(400).json ( {
                success: false,
                message: "user login failed ! All fields are required."
            })
        }

        const user = await userModel.findOne({ email }) ;
        if ( !user ) {
            return res.status(400).json ( {
                success: false,
                message: "user login failed ! Invalid email or password."
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if ( !isPasswordValid ) {
            return res.status(400).json ( {
                success: false,
                message: "user login failed ! Invalid email or password."
            })
        }

        const token = generateToken(user.id);

        return res.status(200).json ( {
            success: true,
            message: "user logged in successfully.",
            token
        })

    } catch (error) {
        console.log("ISE > LOGIN USER FAILED DUE TO EXCEPTION " + error);
        return res.status(500).json ( {
            success: false,
            message: "user login failed ! Something went wrong."
        })
    }

}

const  logoutUser = async (req, res) => {

    try {

        const token = req.headers.authorization?.split(" ")[1];
        if ( !token ) {
            return res.status(400).json ( {
                success: false,
                message: "user logout failed ! Token is required."
            })
        }

        const blackListEntry = new blackListToken ( { token } );
        await blackListEntry.save();

        return res.status(200).json ( {
            success: true,
            message: "user logged out successfully."
        })
        
    } catch (error) {
        console.log("ISE > LOGOUT USER FAILED DUE TO EXCEPTION ");
        return res.status(500).json ( {
            success: false,
            message: "user logout failed ! Something went wrong."
        })
    }
}



export { registerUser, loginUser, logoutUser };