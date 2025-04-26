/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import { Request, Response } from "express";
import { CustomRequestHandler } from "../../types/express.js";
import User from "../models/user.model.js";
import { errorHandler } from "../middlewares/errorHandler.js";

// const is = require("is_js");

export const createUser: CustomRequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { rollNumber, name, department, email } = req.body;

    // if (
    //   is.empty(rollNumber?.trim()) ||
    //   is.empty(name?.trim()) ||
    //   is.empty(department?.trim()) ||
    //   (is.empty(email?.trim()) && is.not.email(email?.trim()))
    // ) {
    //   return res
    //     .status(400)
    //     .json({ error: "All fields must be non-empty strings." });
    // }

    // if (
    //   is.not.string(rollNumber?.trim()) ||
    //   is.not.string(name?.trim()) ||
    //   is.not.string(department?.trim()) ||
    //   is.not.string(email?.trim())
    // ) {
    //   return res
    //     .status(400)
    //     .json({ error: "All fields must be strings values only " });
    // }

    const user = new User({
      rollNumber: rollNumber.trim(),
      name: name.trim(),
      department: department.trim(),
      email: email.trim().toLowerCase(),
    });

    const savedUser = await user.save();

    return res.status(201).json(savedUser);
  } catch (err: any) {
    if (err?.code === 11000) {
      const field = Object.keys(err?.keyPattern)[0];
      return errorHandler(res, 409, `${field} already exists.`);
    }

    return errorHandler(res, 500, `${err}`);
  }
};
