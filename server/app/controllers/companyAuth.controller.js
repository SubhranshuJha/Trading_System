import mongoose from "mongoose";
import bcrypt from "bcrypt";
import companyModel from "../models/componey.model.js";
import blackListToken from "../models/blackListToken.model.js";
import generateToken from "../utils/generateToken.js";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerCompany = async (req, res) => {
    
    try {
    
        let { email , name , password , description , symbol } = req.body;
        symbol = symbol.toUpperCase().trim();

        if ( !email || !name || !password || !symbol ) {
            return res.status(400).json ( {
                success: false,
                message: "company registration failed ! All fields are required."
            })
        }

        if ( name.length < 3 ) {
            return res.status(400).json ( {
                success: false,
                message: "company registration failed ! Name must be at least 3 characters long."
            })
        }

        if ( !passwordRegex.test(password) ) {
            return res.status(400).json ( {
                success: false,
                message: "company registration failed ! Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            })
        }

        const existingCompany = await companyModel.findOne({email}) ;
        if ( existingCompany ) {
            return res.status(400).json ( {
                success: false,
                message: "company registration failed ! Email already exists."
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const companyData = new companyModel ( { email, name, password: hashedPassword, description, symbol } );
        await companyData.save();

        return res.status(201).json ( {
            success: true,
            message: "company registered successfully."
        })

    } catch (error) {
        console.log("ISE > REG COMPANY FAILED DUE TO EXCEPTION ");
        return res.status(500).json ( {
            success: false,
            message: "company registration failed ! Something went wrong."
        })
    }

}

const loginCompany = async (req, res) => {

    try {
        
        const { email , password } = req.body;
        if ( !email || !password ) {
            return res.status(400).json ( {
                success: false,
                message: "company login failed ! All fields are required."
            })
        }

        const company = await companyModel.findOne({ email }) ;
        if ( !company ) {
            return res.status(400).json ( {
                success: false,
                message: "company login failed ! Invalid email or password."
            })
        }

        const isPasswordValid = await bcrypt.compare(password, company.password);
        if ( !isPasswordValid ) {
            return res.status(400).json ( {
                success: false,
                message: "company login failed ! Invalid email or password."
            })
        }

        const token = generateToken(company.id);

        return res.status(200).json ( {
            success: true,
            message: "company logged in successfully.",
            token
        })

    } catch (error) {
        console.log("ISE > LOGIN COMPANY FAILED DUE TO EXCEPTION " + error);
        return res.status(500).json ( {
            success: false,
            message: "company login failed ! Something went wrong."
        })
    }

}

const  logoutCompany = async (req, res) => {

    try {

        const token = req.headers.authorization?.split(" ")[1];
        if ( !token ) {
            return res.status(400).json ( {
                success: false,
                message: "company logout failed ! Token is required."
            })
        }

        const blackListEntry = new blackListToken ( { token } );
        await blackListEntry.save();

        return res.status(200).json ( {
            success: true,
            message: "company logged out successfully."
        })
        
    } catch (error) {
        console.log("ISE > LOGOUT COMPANY FAILED DUE TO EXCEPTION ");
        return res.status(500).json ( {
            success: false,
            message: "company logout failed ! Something went wrong."
        })
    }
}



export { registerCompany, loginCompany, logoutCompany };