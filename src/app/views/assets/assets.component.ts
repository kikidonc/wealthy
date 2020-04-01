import { Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/services/assets.service';
import { DatasetsService } from 'src/app/services/datasets.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  // CHART
  view: any[] = [];
  colorScheme = {
    domain: ['#9370DB']
  };

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = 'Value';
  timeline = true;
  chartData = [];
  // ----------

  assets = [];
  dataset = [];
  addEditAsset = false;

  uid: string;

  assetsQty: number;
  assetsCategoryQty = 0;
  assetsCategory = [];
  assetsCountryQty = 0;
  assetsCountry = [];
  assetsCurrencyQty = 0;
  assetsCurrency = [];

  assetProfileDisplayed = false;
  assetDisplayed: any;
  constructor(
      private assetsService: AssetsService,
      private datasetsService: DatasetsService,
      public authService: AuthService) {
      }

  ngOnInit() {
    if (this.authService.user$) {

      this.loadAssets();
    }
   }

  loadAssets() {
    this.assetsService.getAssets().subscribe(data => {
      this.assets = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      console.log(this.assets);

      this.computeAssetList();
    });
  }

  computeAssetList() {
    // Clear current values
    this.assetsCategory = [];
    this.assetsCountry = [];
    this.assetsCurrency = [];

    // Number of assets
    this.assetsQty = this.assets.length;
    // Extract categories, countries, currencies
    this.assets.forEach(asset => {
      this.assetsCategory.push(asset.category);
      this.assetsCountry.push(asset.country);
      this.assetsCurrency.push(asset.currency);
    });
    // Remove duplicates
    this.assetsCategory = this.assetsCategory.filter((el, i, a) => i === a.indexOf(el));
    this.assetsCountry = this.assetsCountry.filter((el, i, a) => i === a.indexOf(el));
    this.assetsCurrency = this.assetsCurrency.filter((el, i, a) => i === a.indexOf(el));

    // Colelct quantity
    this.assetsCategoryQty = this.assetsCategory.length;
    this.assetsCountryQty = this.assetsCountry.length;
    this.assetsCurrencyQty = this.assetsCurrency.length;
  }

  loadDatasets(assetId): any[] {

    this.datasetsService.getDatasetsByAssetID(assetId).subscribe(data => {
      this.dataset = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      console.log(this.dataset);
      const array = [];
      for (let i = 0, len = this.dataset.length; i < len; i++) {
        const count = i + 1;
        this.dataset[i].count = count;
        const item = this.dataset[i];
        const name = item.periodYear;
        const element = {'name': name, 'value': item.value};
        array.push(element);
      }
      console.log(this.chartData);
      this.chartData = [{ 'name': 'Asset', 'series': array}];
      return this.chartData;
    });
    return null;
  }

  addAsset(asset) {
    this.assetsService.assetEdited = asset;
    this.assetProfileDisplayed = false;
    this.addEditAsset = true;
    this.assetsService.assetEditMode = true;
  }

  showAssetProfile(assetId) {
    this.assetProfileDisplayed = true;
    this.loadDatasets(assetId);
    this.assetDisplayed = this.assets.find(element => element.id === assetId);
  }

  deleteAsset(asset) {
    this.assetsService.deleteAsset(asset);
    this.datasetsService.deleteData(asset.id);
    this.assetProfileDisplayed = false;
    this.computeAssetList();
  }

}
