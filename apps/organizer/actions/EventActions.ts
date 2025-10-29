"use server";
import { revalidatePath } from "next/cache";

export async function CreateInPersonEvent(
  organisationId: string,
  accessToken: string,
  body: FormData,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/in-person/${organisationId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
        body: body,
      }
    );
    const response = await request.json();
    if (response.status === "success") {
      revalidatePath("/events");
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}

export async function UpdateTicketTypes(
  organisationId: string,
  eventId: string,
  accessToken: string,
  data: unknown,
  pathname: string,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/in-person/${organisationId}/${eventId}/ticket-types`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
        body: JSON.stringify(data),
      }
    );
    const response = await request.json();

    if (response.status === "success") {
      revalidatePath(pathname);
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}

export async function CreateDiscountCode(
  eventId: string,
  accessToken: string,
  data: unknown,
  pathname: string,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/discount-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
        body: JSON.stringify(data),
      }
    );
    const response = await request.json();

    if (response.status === "success") {
      revalidatePath(pathname);
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}

export async function MarkDiscountCodeAsInactive(
  eventId: string,
  discountCodeId: string,
  accessToken: string,
  pathname: string,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/discount-code/${discountCodeId}/mark-as-inactive`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
      }
    );
    const response = await request.json();

    if (response.status === "success") {
      revalidatePath(pathname);
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}

export async function MarkDiscountCodeAsActive(
  eventId: string,
  discountCodeId: string,
  accessToken: string,
  pathname: string,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/discount-code/${discountCodeId}/mark-as-active`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
      }
    );
    const response = await request.json();

    if (response.status === "success") {
      revalidatePath(pathname);
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}

export async function UpdateCheckersListAction(
  eventId: string,
  accessToken: string,
  pathname: string,
  body: unknown,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/checkers`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
        body: JSON.stringify(body),
      }
    );
    const response = await request.json();

    if (response.status === "success") {
      revalidatePath(pathname);
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}

export async function MarkAsActive(
  eventId: string,
  accessToken: string,
  pathname: string,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/mark-as-active`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
      }
    );
    const response = await request.json();

    if (response.status === "success") {
      revalidatePath(pathname);
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}

export async function MarkAsInactive(
  eventId: string,
  accessToken: string,
  pathname: string,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/mark-as-inactive`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
      }
    );
    const response = await request.json();

    if (response.status === "success") {
      revalidatePath(pathname);
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}

export async function CheckInWithTicketID(
  eventId: string,
  accessToken: string,
  pathname: string,
  ticketID: string,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/ticket-id/${ticketID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
      }
    );
    const response = await request.json();

    if (response.status === "success") {
      // revalidatePath(pathname)
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}
export async function CreateGoogleMeetEvent(
  organisationId: string,
  accessToken: string,
  body: FormData,
  code: string,
  locale: string
) {
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/meet/${organisationId}/${code}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Accept-Language": locale,
          origin: process.env.NEXT_PUBLIC_APP_URL ?? "",
        },
        body: body,
      }
    );
    const response = await request.json();

    if (response.status === "success") {
      revalidatePath("/events");
      return {
        status: "success",
      };
    } else {
      throw new Error(response.message);
    }
  } catch (error: any) {
    return {
      error: error?.message ?? "An unknown error occurred",
    };
  }
}
