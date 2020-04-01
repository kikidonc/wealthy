import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetsService {

  datasets: Observable<any[]>;

  constructor(private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private configService: ConfigService) { }

    getDatasets() {
      const uid = this.auth.auth.currentUser.uid;
      this.datasets = this.afs.collection(`accounts/${uid}/datasets`).snapshotChanges();
      return this.datasets;
    }


    getDatasetsByAssetID(assetId) {
      const uid = this.auth.auth.currentUser.uid;
      this.datasets = this.afs.collection(`accounts/${uid}/datasets`, ref =>
        ref.where("assetId", "==", `${assetId}`).orderBy('periodYear').orderBy('periodMonth'))
        .snapshotChanges();
      return this.datasets;
    }

    saveDataset(data) {
      const uid = this.auth.auth.currentUser.uid;
      let dataset = {};
      if (data.category) {
        dataset = {
          assetId: data.id,
          asset: data.name,
          periodMonth: data.entryMonth,
          periodYear: data.entryYear,
          value: data.entryAmount
        };
      } else {
        dataset = data;
      }
      console.log('DATASET: ',dataset);

      return this.afs.collection(`accounts/${uid}/datasets`).add(dataset).then(docRef => {
        this.afs.collection(`accounts/${uid}/datasets`).doc(`${docRef.id}`).update({id: `${docRef.id}`});
      }).catch(function(error) {
        console.log('Save Asset:', error);
      });
    }

    updateDataset(dataset) {
      const uid = this.auth.auth.currentUser.uid;
      return this.afs.collection(`accounts/${uid}/datasets`).doc(dataset.id).update(dataset)
      .catch(function(error) {
        console.log('Save Asset:', error);
      });
    }

  //   createNewDatasets(asset) {
  //     const uid = this.auth.auth.currentUser.uid;

  //     // const months = this.configService.loadMonths();

  //     if (asset) {
  //       const entryYear = Number(asset.entryYear);
  //       let count = 0;
  //       if (asset.exitYear) {
  //         count = Number(asset.exitYear) - Number(asset.entryYear);
  //       } else {
  //         count = 30 ;
  //       }
  //       console.log(count);

  //       let counter = entryYear + 1;
  //       let value = asset.entryAmount;
  //       for (let index = 0; index < count; index++) {
  //         if (asset.increaseType === 'Percentage') {
  //           value = value * (1 + asset.increaseValue / 100);
  //         }
  //         if (asset.increaseType === 'Value') {
  //           value = value + asset.increaseValue;
  //         }
  //         const newDataset = {
  //           assetId: asset.id,
  //           asset: asset.name,
  //           periodMonth: '01',
  //           periodYear: String(counter),
  //           value: Math.round(value),
  //         };
  //         counter = counter + 1;
  //         this.afs.collection(`accounts/${uid}/datasets`).add(newDataset);
  //       }
  //     }
  // }

  deleteData(assetId) {
    const uid = this.auth.auth.currentUser.uid;
    this.getDatasetsByAssetID(assetId).subscribe(data => {
      const list = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      for (let index = 0; index < list.length; index++) {
        const item = list[index].id;
        this.afs.doc(`accounts/${uid}/datasets/${item}`).delete();
      }
    });
  }
}
