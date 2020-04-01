import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from 'src/app/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  stocks: Observable<any[]>;

  constructor(private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private alertService: AlertService) { }

  getStocks() {
    const uid = this.auth.auth.currentUser.uid;
    this.stocks = this.afs.collection(`accounts/${uid}/stocks`).snapshotChanges();
    return this.stocks;
  }

  saveStock(stock) {
    const uid = this.auth.auth.currentUser.uid;

    console.log(stock);
    return this.afs.collection(`accounts/${uid}/stocks`).add(stock).then(docRef => {
      this.afs.collection(`accounts/${uid}/stocks`).doc(`${docRef.id}`).update({id: `${docRef.id}`}).then(data => {
        stock.id = docRef.id;
      });
    }).catch(function(error) {
      console.log('Save Stock:', error);
    });
  }

}
