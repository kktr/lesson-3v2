import nock from 'nock';
import { networkInterfaces } from 'os';
import { resolve } from 'path';
import { getCurrencyData } from './getCurrencyData';
import { saveRecordings } from './test-utils/saveRecordings';
import { ExchangeRates } from './types/ExchangeRates';

function subtract(b: number, c: number) {
  let b1 = b.toString().split('.');
  let b1_max = 0;
  if (b1.length == 2) {
    b1_max = b1[1].length;
  }

  let c1 = c.toString().split('.');
  let c1_max = 0;
  if (c1.length == 2) {
    c1_max = c1[1].length;
  }

  let max_len = b1_max > c1_max ? b1_max : c1_max;

  return Number((b - c).toFixed(max_len));
}

const calculateRateDifference = (
  data1: ExchangeRates,
  data2: ExchangeRates
) => {
  const exchangeRates1 = data1.rates[0].bid;
  const exchangeRates2 = data2.rates[0].bid;

  return subtract(exchangeRates1, exchangeRates2);
};

describe('currenciesApi', () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  it('returns correctly currencies for today ', async () => {
    // nock.recorder.rec({ output_objects: true, dont_print: true });
    nock.load(resolve(__dirname, '__tapes__', 'currenciesForToday.json'));
    const data = await getCurrencyData('2022-03-22');
    expect(data.rates[0].bid).toBe(4.213);

    // saveRecordings(__dirname, 'currenciesForToday');
  });

  it('returns correctly currencies for 1 week ago', async () => {
    // nock.recorder.rec({ output_objects: true, dont_print: true });
    nock.load(
      resolve(__dirname, '__tapes__', 'currenciesForOneWeekBefore.json')
    );
    const data = await getCurrencyData('2022-03-15');
    expect(data.rates[0].bid).toBe(4.2585);

    // saveRecordings(__dirname, 'currenciesForOneWeekBefore');
  });

  it('returns correctly calculate difference between currencies', async () => {
    nock.load(resolve(__dirname, '__tapes__', 'currenciesForToday.json'));
    const dataToday = await getCurrencyData('2022-03-22');

    nock.load(
      resolve(__dirname, '__tapes__', 'currenciesForOneWeekBefore.json')
    );
    const dataOneWeekAgo = await getCurrencyData('2022-03-15');

    expect(calculateRateDifference(dataToday, dataOneWeekAgo)).toBe(-0.0455);
  });
});

describe('currenciesApi tests only with jest', () => {
  afterEach(jest.clearAllMocks);

  const mockGetCurrencyData = jest.fn(
    (data: string) =>
      Promise.resolve({
        table: 'C',
        currency: 'dolar amerykański',
        code: 'USD',
        rates: [
          {
            no: '056/C/NBP/2022',
            effectiveDate: data,
            bid: data === '2022-03-22' ? 4.213 : 4.2585,
            ask: data === '2022-03-22' ? 4.2982 : 4.3445,
          },
        ],
      }) as unknown as ExchangeRates
  );

  it('returns correctly currencies for today ', async () => {
    const data = await mockGetCurrencyData('2022-03-22');
    expect(data.rates[0].bid).toBe(4.213);
    expect(mockGetCurrencyData).toBeCalledTimes(1);
  });

  it('returns correctly currencies for 1 week ago', async () => {
    const data = await mockGetCurrencyData('2022-03-15');
    expect(data.rates[0].bid).toBe(4.2585);
    expect(mockGetCurrencyData).toBeCalledTimes(1);
  });

  it('returns correctly calculate difference between currencies', async () => {
    const dataToday = await mockGetCurrencyData('2022-03-22');
    const dataOneWeekAgo = await mockGetCurrencyData('2022-03-15');

    expect(calculateRateDifference(dataToday, dataOneWeekAgo)).toBe(-0.0455);
    expect(mockGetCurrencyData).toBeCalledTimes(2);
  });
});
