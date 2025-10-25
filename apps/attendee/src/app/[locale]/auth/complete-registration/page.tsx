import Currency from "@/types/Currency";
import jwt, { JwtPayload } from "jsonwebtoken";
import CompleteRegistrationForm from "./CompleteRegistrationForm";

export default async function CompleteRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const accessToken = (await searchParams).accessToken as string;
  const decoded = jwt.verify(
    accessToken ?? "",
    process.env.NEXT_PUBLIC_JWT_SECRET ?? ""
  );
  const { type, iat, exp, ...user } = decoded as JwtPayload;
  const currencyRequest = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/currencies`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const currencyResponse = await currencyRequest.json();
  const currencies: Currency[] = currencyResponse.currencies;
  return (
    <>
      <CompleteRegistrationForm
        currencies={currencies}
        email={user.email}
        password={user.password}
        accessToken={accessToken}
      />
    </>
  );
}
