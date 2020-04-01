import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  userProfile: any;
  profile: Observable<any>;
  profileSubscription: any;
  groups: Observable<any>;
  groupsSubscription: any;
  categories: Observable<any>;
  categoriesSubscription: any;
  uid: string;
  user: any;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.getCurrentUser();
  }

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      // tslint:disable-next-line: only-arrow-functions
      this.user = this.auth.auth.onAuthStateChanged(function(user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  getUserProfile() {
    return this.afs.collection('accounts').doc(this.auth.auth.currentUser.uid).valueChanges();
  }

  getGroups() {
    return this.afs.collection(`accounts/${this.auth.auth.currentUser.uid}/groups`).valueChanges();
  }

  getCategories() {
    return this.afs.collection(`accounts/${this.auth.auth.currentUser.uid}/categories`).valueChanges();
  }


  saveProfile(profile) {
    return this.afs.collection('accounts/').doc(this.auth.auth.currentUser.uid).set(profile);
  }

  updateGroup(group) {
    const uid = this.auth.auth.currentUser.uid;
    return this.afs.collection(`accounts/${uid}/groups`).doc(group.id).update(group);
  }

  saveGroup(group) {
    const uid = this.auth.auth.currentUser.uid;
    return this.afs.collection(`accounts/${uid}/groups`).add(group).then(docRef => {
      this.afs.collection(`accounts/${uid}/groups`).doc(`${docRef.id}`).update({id: `${docRef.id}`});
    }).catch(function(error) {
      console.log(error);
    });
  }

  updateDocId(docId) {
    const uid = this.auth.auth.currentUser.uid;
    console.log('updateDocId ', uid, docId);

    return this.afs.collection(`accounts/${uid}/groups`).doc(docId).update({id: docId});
  }

  deleteGroup(group) {
    console.log(group);

    const uid = this.auth.auth.currentUser.uid;
    return this.afs.collection(`accounts/${uid}/groups`).doc(group.id).delete();
  }

  saveCategory(category) {
    console.log('SAVE CATEGORY: ', category);
    const uid = this.auth.auth.currentUser.uid;
    return this.afs.collection(`accounts/${uid}/categories`).doc(category['name']).set(category);
  }

  deleteCategory(category) {
    console.log('DELETE CATEGORY: ', category);
    const uid = this.auth.auth.currentUser.uid;
    return this.afs.collection(`accounts/${uid}/categories`).doc(category).delete();
  }

  dispose() {
    console.log('DISPOSE');
    this.profile = null;
    this.groups = null;
    this.categories = null;
  }

}
