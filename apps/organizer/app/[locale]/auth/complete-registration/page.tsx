import jwt, { JwtPayload } from "jsonwebtoken";
import CompleteRegistrationForm from "./CompleteRegistrationForm";
import { Country } from "@workspace/typescript-config";

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
  const countries = await fetch(
    "https://restcountries.com/v3.1/all?fields=name"
  )
    .then((res) => res.json())
    .then((res) => {
      const sortedCountries: Country[] = res.sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common)
      );
      return sortedCountries;
    });
  return (
    <>
      <CompleteRegistrationForm
        email={user.email}
        password={user.password}
        accessToken={accessToken}
        countries={countries}
      />
    </>
  );
}
