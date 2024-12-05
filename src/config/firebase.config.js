const admin = require('firebase-admin');
const config = require('./env.config');

const initializeFirebase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(config.firebase.credential),
        storageBucket: config.firebase.storageBucket,
    });

    return admin.storage().bucket();
};

module.exports = {
    initializeFirebase
};