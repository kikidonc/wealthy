import { Component, OnInit } from '@angular/core';
import { Portfolio, AssetCategory } from '../../shared/portfolio.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  portfolio: Portfolio = {
    portfolioValue: 1000,
    assetCategoryList: [
      {categoryName: 'cat1', categoryValue: 10},
      {categoryName: 'cat2', categoryValue: 20}
    ],
    portfolioHistory : [
      {period: 202001, value: 13},
      {period: 201912, value: 12},
      {period: 201911, value: 11}
    ]
  };
  cat1: AssetCategory;
  cat2: AssetCategory;

  constructor() { }

  ngOnInit() {
    console.log(this.portfolio);
  }

}
