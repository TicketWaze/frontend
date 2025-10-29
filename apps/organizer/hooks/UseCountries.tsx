import { Country } from "@workspace/typescript-config";
import { useEffect, useState } from "react";

function UseCountries() {
  const [countries, setCountries] = useState<Country[] | undefined>();
  useEffect(function () {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((res) => {
        const sortedCountries = res.sort((a: Country, b: Country) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      });
  }, []);
  return countries;
}

export default UseCountries;
