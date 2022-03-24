import nock from "nock";
import { resolve } from "path";
import { getCurrencyData } from "./getCurrencyData";

describe("currenciesApi", () => {
  it("works", async () => {
    nock.load(resolve(__dirname, "__tapes__", "getCurrencies.json"));
    const data = await getCurrencyData();
    expect(data.rates[0].bid).toBe(3.6929);
  });
});
