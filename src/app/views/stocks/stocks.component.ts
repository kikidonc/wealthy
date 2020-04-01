import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { StocksService } from 'src/app/services/stocks.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})

export class StocksComponent implements OnInit {

  stocks = [];
  editStockMode = false;
  stockDisplayed = [];
  stockDisplayedMode = false;
  stockForm: FormGroup;
  currencies = [];

  constructor(
      private fb: FormBuilder,
      private configService: ConfigService,
      private stocksService: StocksService,
      public authService: AuthService) {
      }

  ngOnInit() {
    if (this.authService.user$) {
      this.loadStocks();
    }

    // Load currencies
    this.configService.loadCurrencies().pipe(take(1)).subscribe(data => {
      this.currencies = data;
      console.log(data);
    });

    // Preset Asset Form
    this.stockForm = this.fb.group({
      id: ['', ],
      name: ['', [
        Validators.required
      ]],
      position: ['', [
        Validators.required
      ]],
      currency: ['', [
        Validators.required
      ]],
      ticker: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]],
      averagePrice: ['', [
        Validators.required
      ]]
    });

   }

  loadStocks() {
    this.stocksService.getStocks().subscribe(data => {
      this.stocks = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      console.log(this.stocks);
    });
  }

  addStock() {
    this.editStockMode = true;
  }

  editStock() {
    this.editStockMode = true;
  }

  saveStock() {
    this.editStockMode = false;
  }

}
