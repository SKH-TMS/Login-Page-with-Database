// app/api/login/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Fetching the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

export async function POST(req: Request) {
  const client = new MongoClient(uri as string);

  try {
    // Parse the request body
    const { email, password } = await req.json();

    // Connect to the MongoDB database
    await client.connect();
    const db = client.db("team_manager_db");
    const collection = db.collection("register_user");

    // Find the user with the matching email
    const user = await collection.findOne({ email });

    // If user is not found or the password doesn't match
    if (!user || user.password !== password) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Return a success response if login is successful
    return NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }, // Example of user data
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to log in. Please try again later.",
    });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}
