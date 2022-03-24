import { ExchangeRates } from "./types/ExchangeRates";
import fetch from "node-fetch";

export async function getCurrencyData() {
  const response = await fetch(
    "http://api.nbp.pl/api/exchangerates/rates/c/usd/2016-04-04/?format=json"
  );
  return (await response.json()) as ExchangeRates;
}
