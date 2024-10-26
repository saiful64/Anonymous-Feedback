import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse<any>> {
  // send email

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "True feedback Verification Code",
      react: VerificationEmail({ username, otp }),
    });
    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return {
      success: false,
      message: "Error sending verification",
    };
  }
}
