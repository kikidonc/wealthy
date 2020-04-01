import { Component, OnInit } from '@angular/core';
import { timer, Subscription} from 'rxjs';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { AccountService } from 'src/app/services/account.service';
import { ConfigService } from 'src/app/services/config.service';
import { AssetsService } from 'src/app/services/assets.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { DatasetsService } from 'src/app/services/datasets.service';

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.scss']
})
export class AddAssetComponent implements OnInit {

  assetForm: FormGroup;

  groups = [];
  currencies = [];
  categories = [];
  countries = [];
  months = [];
  uid: any;

  asset: any;

  constructor(
    private fb: FormBuilder,
    public alertService: AlertService,
    private afAuth: AngularFireAuth,
    private accountService: AccountService,
    private configService: ConfigService,
    private assetsService: AssetsService
    ) { }

  ngOnInit() {

    this.uid = this.afAuth.auth.currentUser.uid;



    // Load GROUP
    this.accountService.getGroups().pipe(take(1)).subscribe(data => {
      this.groups = data;
      console.log(data);
    });
    // Load currencies
    this.configService.loadCurrencies().pipe(take(1)).subscribe(data => {
      this.currencies = data;
      console.log(data);
    });
    // Load Categories
    this.accountService.getCategories().pipe(take(1)).subscribe(data => {
      this.categories = data;
      console.log(data);
    });
    // Load Countries
    this.configService.loadCountries().pipe(take(1)).subscribe(data => {
      this.countries = data;
      console.log(data);
    });
    // Load Months
    this.months = this.configService.loadMonths();

    // Preset Asset Form
    this.assetForm = this.fb.group({
      id: ['', ],
      name: ['', [
        Validators.required
      ]],
      category: ['', [
        Validators.required
      ]],
      currency: ['', [
        Validators.required
      ]],
      country: ['', [
        Validators.required
      ]],
      group: ['', [
        Validators.required
      ]],
      increaseType: ['', [
        Validators.required
      ]],
      entryAmount: ['', [
        Validators.required
      ]],
      entryMonth: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(2),
        Validators.maxLength(2)
      ]],
      entryYear: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]],
      exitMonth: ['', [
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(2),
        Validators.maxLength(2)
      ]],
      exitYear: ['', [
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(4),
        Validators.maxLength(4)
      ]],
      increaseValue: ['', [
        Validators.required
      ]]
    });

    // Load asset if edit mode
    if (this.assetsService.assetEdited) {
      this.asset = this.assetsService.assetEdited;
      this.assetForm.patchValue(this.asset);
    }
  }


  async saveAsset() {
    console.log(this.assetForm.value);
    if (this.assetForm.valid) {

      this.assetForm.value.entryAmount = Number(this.assetForm.value.entryAmount);
      // this.assetForm.value.entryMonth = Number(this.assetForm.value.entryMonth);
      // this.assetForm.value.entryYear = Number(this.assetForm.value.entryYear);
      this.assetForm.value.increaseValue = Number(this.assetForm.value.increaseValue);
      try {
        if (this.asset) {
          this.assetsService.updateAsset(this.assetForm.value);
          this.assetsService.assetEdited = null;
        } else {
          this.assetsService.saveAsset(this.assetForm.value);
          // this.datasetsService.saveDataset(this.assetForm.value);
        }
        this.alertService.success('Asset saved succesfully');
        this.assetsService.assetEditMode = false;
      } catch (err) {
        console.error(err);
        this.alertService.error(err);
      }
    } else {
      this.alertService.error('Form incomplete.');
    }
  }

  cancelAddAsset() {
    this.assetForm.reset();
    this.assetsService.assetEditMode = false;
    this.assetsService.assetEdited = null;
  }


}
