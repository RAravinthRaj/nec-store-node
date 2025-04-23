/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import express from "express";
import User, { Role } from "../models/user.model.js";

const is = require("is_js");

const router = express.Router();

type CustomRequestHandler = (
  req: express.Request,
  res: express.Response
) => Promise<any>;

const createUser: CustomRequestHandler = async (req, res) => {
  try {
    const { rollNumber, name, department, email } = req.body;

    if (
      is.empty(rollNumber?.trim()) ||
      is.empty(name?.trim()) ||
      is.empty(department?.trim()) ||
      (is.empty(email?.trim()) && is.not.email(email?.trim()))
    ) {
      return res
        .status(400)
        .json({ error: "All fields must be non-empty strings." });
    }

    const user = new User({
      rollNumber: rollNumber.trim(),
      name: name.trim(),
      department: department.trim(),
      email: email.trim().toLowerCase,
    });

    const savedUser = await user.save();

    return res.status(201).json(savedUser);
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err?.keyPattern)[0];
      return res.status(409).json({ error: `${field} already exists` });
    }

    return res.status(400).json({ error: err?.message });
  }
};

router.post("/sign-up", createUser);

export default router;
