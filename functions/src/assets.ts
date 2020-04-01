const functions = require('firebase-functions');
import * as admin from 'firebase-admin';
import { EventContext } from 'firebase-functions';

const db = admin.firestore();

export const createDatasetsNewAsset = functions.firestore
  .document('accounts/{accountId}/assets/{assetId}')
  .onCreate((async(snap: admin.firestore.DocumentSnapshot, context: EventContext) => {
    const asset = snap.data();
    const docId = context.params.assetId;
    const accountId = context.params.accountId;
    if (asset) {
      const entryYear = Number(asset.entryYear);
      let count = 0;
      if (asset.exitYear) {
        count = Number(asset.exitYear) - Number(asset.entryYear);
      } else {
        count = 50 ;
      }

      let counter = entryYear + 1;
      let value = asset.entryAmount;

      let batch = db.batch();

      for (let index = 0; index < count; index++) {
        if (asset.increaseType === 'Percentage') {
          value = value * (1 + asset.increaseValue / 100);
        }
        if (asset.increaseType === 'Value') {
          value = value + asset.increaseValue;
        }
        const docData = {
          assetId: docId,
          asset: asset.name,
          periodMonth: '01',
          periodYear: String(counter),
          value: Math.round(value),
        };
        const ref = db.collection(`accounts/${accountId}/datasets`).doc();

        counter = counter + 1;
        batch.set(ref, docData);
      }
      return batch.commit().then(function () {
        console.log('New dataset batch completed', batch);
      }).catch(err => {
        console.log('New dataset batch ERROR:', err);
      });
    }
    return context;
  }))
