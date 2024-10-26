import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = { username: searchParams.get("username") };

    //validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is available" },
      { status: 400 }
    );
  } catch (e) {
    console.error("Error checking username", e);
    return Response.json(
      { success: false, message: "Error checking username" },
      { status: 500 }
    );
  }
}
