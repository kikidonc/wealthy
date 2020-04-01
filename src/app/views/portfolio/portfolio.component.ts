import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AssetsService } from 'src/app/services/assets.service';
import { AuthService } from 'src/app/services/auth.service';
import { PortfolioService } from 'src/app/services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  assets = [];
  datasets = [];

  constructor(
    private assetsService: AssetsService,
    public portfolioService: PortfolioService,
    public authService: AuthService) {}

  ngOnInit() {
    if (this.authService.user$) {
      this.loadPortfolio();
    }
  }

  loadPortfolio() {
    this.portfolioService.computePortfolio();
    this.assets = this.portfolioService.assets;
    this.datasets = this.portfolioService.list;
  }

}
