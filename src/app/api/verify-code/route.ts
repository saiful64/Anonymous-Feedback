import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { decode } from "punycode";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await User.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: "Verification code expired" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }
  } catch (e) {
    console.error("Error verifying user", e);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
