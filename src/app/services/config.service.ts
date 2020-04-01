import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  currencies: Observable<any>;
  countries: Observable<any>;
  categories: Observable<any>;
  months: string[];
  constructor(private afs: AngularFirestore) { }

  loadCurrencies() {
    if (!this.currencies) {
      this.currencies = this.afs.collection('public/config/currency').valueChanges();
      return this.currencies;
    } else {
      return this.currencies;
    }
  }

  loadCountries() {
    if (!this.countries) {
      this.countries = this.afs.collection('public/config/country').valueChanges();
    }
    return this.countries;
  }



  loadMonths() {
    if (!this.months) {
      this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
     }
    return this.months;
  }

  loadDefaultCategories() {
    this.categories = this.afs.collection('public/config/categories').valueChanges();
      return this.categories;
  }

}
