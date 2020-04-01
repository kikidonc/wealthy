import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from '../services/alert.service';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    public alertsService: AlertService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = await this.afAuth.auth.currentUser;
    const isLoggedIn = !!user;
    if (!isLoggedIn) {

      this.alertsService.error('Authtication error');
    }
    return isLoggedIn;
  }
}
