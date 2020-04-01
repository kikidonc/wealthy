import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { ConfigService } from './config.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})



export class AuthService {

  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private configService: ConfigService,
    private router: Router) {
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.afs.doc<any>(`accounts/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
      );
    }

  // async googleSignin() {
  //   const provider = new auth.GoogleAuthProvider();
  //   const credential = await this.afAuth.auth.signInWithPopup(provider);
  //   return this.updateUserData(credential.user);
  // }

  // private updateUserData(user) {
  //   // Sets user data to firestore on login
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`accounts/${user.uid}`);
  //   const data = {
  //     uid: user.uid,
  //     email: user.email,
  //     displayName: user.displayName,
  //   };
  //   return userRef.set(data, { merge: true });
  // }

  createProfile(profile) {
    const user = this.afAuth.auth.currentUser;
    console.log('CREATE PROFILE:', user);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`accounts/${user.uid}`);

    profile.uid = user.uid;
    this.configService.loadDefaultCategories().subscribe(data => {
      data.forEach(element => {
        console.log('CREATE PROFILE - ELEMENT TO BE ADDED', element);

        this.afs.collection(`accounts/${user.uid}/categories`).add(element);
      });
    });
    return userRef.set(profile, { merge: true }).then(result => {
      console.log('CREATE PROFILE:', result);
    });
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

}
