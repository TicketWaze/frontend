"use server";
import { revalidatePath } from "next/cache";

export async function UpdateUserProfile(
  firstName: string,
  lastName: string,
  phoneNumber: string,
  accessToken: string,
  locale: string
) {
  try {
    const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": locale,
        origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phoneNumber,
      }),
    });
    const response = await request.json();
    if (response.status === "failed") {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
  revalidatePath("/settings/account");
}

export async function UpdateUserProfileImage(
  accessToken: string,
  body: FormData
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/upload-image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: body,
      }
    );

    const data = await res.json();
    if (data.status === "success") {
      revalidatePath("/settings/account");
      return {
        status: "success",
        message: "Image Uploaded",
      };
    } else {
      return {
        status: "failed",
        message: data.message,
      };
    }
  } catch (err: any) {
    return {
      error: err?.message ?? "An unknown error occurred",
    };
  }
}
