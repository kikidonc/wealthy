import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  baseUrl = 'http://data.fixer.io/api/';
  accessKey = '2b1d2c3d581a98cdd2920d0c3317da91';

  currencies: any[];
  currencyRates: {};

  constructor(public http: HttpClient) { }

  downloadCurrencyRate() {
    const rates = this.http.get(this.baseUrl + 'latest?access_key=' + this.accessKey);
    rates.subscribe(element => {
      this.currencyRates = element['rates'];
      // this.afs.doc('config/currency/values/rates/').set(this.currencyRates);
    });
  }

  // loadCurrency() {
  //   this.currencies = Array.of(
  //     {
  //         symbol: '$',
  //         name: 'US Dollar',
  //         symbol_native: '$',
  //         decimal_digits: 2,
  //         rounding: 0,
  //         code: 'USD',
  //         name_plural: 'US dollars'
  //     },
  //     {
  //         symbol: '€',
  //         name: 'Euro',
  //         symbol_native: '€',
  //         decimal_digits: 2,
  //         rounding: 0,
  //         code: 'EUR',
  //         name_plural: 'euros'
  //     },
  //     {
  //         symbol: 'HK$',
  //         name: 'Hong Kong Dollar',
  //         symbol_native: '$',
  //         decimal_digits: 2,
  //         rounding: 0,
  //         code: 'HKD',
  //         name_plural: 'Hong Kong dollars'
  //     },
  //     {
  //         symbol: 'S$',
  //         name: 'Singapore Dollar',
  //         symbol_native: '$',
  //         decimal_digits: 2,
  //         rounding: 0,
  //         code: 'SGD',
  //         name_plural: 'Singapore dollars'
  //     });
  //   }
}
