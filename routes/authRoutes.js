const express = require('express');
const router = express.Router();
const bcrpyt = require('bcrypt');
const createDB = require("../config/db");
const User = require("../models/userModels");
const {
    validateName,
    validateEmail,
    validatePassword
} = require("../utiles/validators");


createDB.sync().then(() => {
    console.log("DB is running")
});


router.post("/signup", async (req, res) => {
    try{
        const { name, email, password } = req.body;
       
        const userExit = await User.findOne({
            where: {
                email: email
            }
        })

        if (userExit) {
            return res.status(403).send("User already esists");
        }

        if(!validateName(name)) {
           return res
           .status(400)
           .send("Error: Invalid user name: name must be longer than two characters and must not include any number or special characters")
        }

        if(!validateEmail(email)) {
            return res.status(400).send("Invalid email")
        }

        if(!validatePassword(password)) {
            return res
            .status(400)
            .send("Error: Invalid password: password must be at least characters long and must include atleast one - one uppercase letter, one lowercase letter, one digit, one special character")
        }

        const hashedpassword = await bcrpyt.hash(password, 10);

        const user = {
            name, email, password: hashedpassword
        };
        const createdUser = await User.create(user);

        console.log(createdUser);

        return res
        .status(201)
        .send(createdUser);
    }catch (err){
        res.status(500).send(err.message);
    }

});

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (email.length === 0) {
            return res.status(400).send("Error: please enter your email");
        }
        if (password.length === 0) {
            return res.status(400).send("Error: please enter your password");
        }

        const userExit = await user.findOne({ where: { email: email}});

        if(!userExit) {
           return res.status(404).send("Error: User not found");
        }

        const passwordMatched = await bcrpyt.compare(
            password,
            userExit.password);

        if(!passwordMatched) {
            return res.status(400).send("Error: Incorrect password")
        }

        return res
        .status(200)
        .send(`Welcome to Backend ${userExit.name}. you are logged in`);
    }catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

module.exports = router;