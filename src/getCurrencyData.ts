import { ExchangeRates } from './types/ExchangeRates';
import fetch from 'node-fetch';

export async function getCurrencyData(data: string) {
  const response = await fetch(
    `http://api.nbp.pl/api/exchangerates/rates/c/usd/${data}/?format=json`
  );
  return (await response.json()) as ExchangeRates;
}
