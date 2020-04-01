import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();
let defaultSet = false;

export const createAccountRecord = functions.auth
  .user()
  .onCreate((user, context) => {
    const userRef = db.doc(`accounts/${user.uid}`);
    // return userRef.set({
    //   displayName: user.displayName,
    //   email: user.email,
    //   uid: user.uid,
    //   createdAt: context.timestamp,
    //   currency: '',
    //   country: '',
    //   yearsLife: 60,
    //   name: user.displayName
    // }).then(() => {
      return admin.firestore().collection(`accounts/${user.uid}/groups`)
      .doc()
      .set({
        name: user.displayName,
        role: 'default'
      }).then(() => {
        return admin.firestore().collection(`accounts/${user.uid}/group`).get().then(snapshot => {
            snapshot.forEach(snap => {
              if (snap.data().role === 'default' && defaultSet === true){
                return admin.firestore().collection(`accounts/${user.uid}/group`).doc(snap.id).delete();
              } else if (snap.data().role === 'default') {
                defaultSet = true;
              }
              return '';
            });
            return '';
        });
      });
  // });
});


export const deleteAccount = functions.auth
  .user()
  .onDelete((user, context) => {
    const userRef = db.doc(`accounts/${user.uid}`);
    return userRef.delete();
});
