import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AssetsService } from 'src/app/services/assets.service';
import { DatasetsService } from 'src/app/services/datasets.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  assets = [];
  datasets = [];
  list = [];

  constructor(private afs: AngularFirestore,
              private auth: AngularFireAuth,
              private assetsService: AssetsService,
              private datasetsService: DatasetsService) { }

  computePortfolio() {
    this.assetsService.getAssets().subscribe(data => {
      this.assets = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      for (let i = 0, len = this.assets.length; i < len; i++) {
        this.getDatasets(this.assets[i].id);
      }
    });
  }

  getDatasets(assetId) {
    this.datasetsService.getDatasetsByAssetID(assetId).subscribe(data => {
      const dataset = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      this.list = this.list.concat(dataset);
      // for (let i = 0, len = this.list.length; i < len; i++) {
      //   for (let n = 0, len2 = this.list.length; n < len2; n++) {
      //     if (this.list[i].periodYear === this.list[n].periodYear) {
            // const value = this.list[i].value + this.list[n].value;
            // const data = { 'period': this.list[i].periodYear, 'value': value}

        //     this.datasets[`${this.list[i].periodYear}`] = this.datasets[`${this.list[i].periodYear}`] + this.list[n].value;
        //     console.log('in loop', this.list[n].value);
        //   }
        // }
      // }
    });
  }

}
