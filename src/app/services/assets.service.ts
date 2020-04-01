import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from 'src/app/services/alert.service';
import { DatasetsService } from 'src/app/services/datasets.service';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  assets: Observable<any[]>;
  assetEditMode = false;

  assetEdited: any;

  constructor(private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private accountService: AccountService,
              private datasetsService: DatasetsService,
              private alertService: AlertService) {}

  getAssets() {
    const uid = this.auth.auth.currentUser.uid;
    this.assets = this.afs.collection(`accounts/${uid}/assets`).snapshotChanges();
    return this.assets;
  }

  saveAsset(asset) {
    const uid = this.auth.auth.currentUser.uid;
    // const
    console.log(asset);
    return this.afs.collection(`accounts/${uid}/assets`).add(asset).then(docRef => {
      this.afs.collection(`accounts/${uid}/assets`).doc(`${docRef.id}`).update({id: `${docRef.id}`}).then(data => {
        asset.id = docRef.id;
        console.log(asset);
        this.datasetsService.saveDataset(asset);
      });
    }).catch(function(error) {
      console.log('Save Asset:', error);
    });
  }

  updateAsset(asset) {
    const uid = this.auth.auth.currentUser.uid;
    return this.afs.collection(`accounts/${uid}/assets`).doc(asset.id).update(asset)
    .catch(function(error) {
      console.log('Save Asset:', error);
    });
  }

  deleteAsset(asset) {
    const uid = this.auth.auth.currentUser.uid;
    return this.afs.collection(`accounts/${uid}/assets`).doc(asset.id).delete().then(element => {
      this.alertService.success('Asset deleted succesfully');
    })
    .catch(function(error) {
      this.alertService.error(error);
    });
  }

}
