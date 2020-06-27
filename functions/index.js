const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const stripe = require('stripe')(functions.config().stripe.testkey);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.stripeCharge = functions.database.ref('/payments/{userId}/{paymentId}').onWrite(event => {
    const payment = event.data.val();
    const userId = event.params.userId;
    const paymentId = event.params.paymentId;

    if (!payment || payment.charge) return;

    return admin.database().ref(`/users/${userId}`).once('value').then( snapshot =>{
        return snapshot.val();
    }).then(customer => {
        const amount = payment.amount;
        const idempotency_key = paymentId;
        const source = payment.token.id;
        const currency = 'usd';
        const charge = {amount,currency,source};

        return stripe.charges.create(charge,{idempotency_key});
    })
    .then(charge => {
        admin.database()
        .ref(`/payments/${userId}/${paymentId}/charge`)
        .set(charge);
        return true;
        })
})