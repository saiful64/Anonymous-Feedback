import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    // Check if user already exists with the same username and is verified
    const existingUserVerifiedByUsername = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Check if user already exists with the same email
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = await new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        messages: [],
      });

      await newUser.save();
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        newUser.verifyCode
      );
      if (!emailResponse.success) {
        return Response.json(
          { success: false, message: emailResponse.message },
          { status: 500 }
        );
      }
      return Response.json(
        {
          success: true,
          message: "User registered successfully. Please verify your email",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error in sign up", error);
    return Response.json(
      { success: false, message: "Error in sign up" },
      { status: 500 }
    );
  }
}
