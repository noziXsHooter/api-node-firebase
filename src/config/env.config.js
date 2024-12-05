const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});

// Validação das variáveis de ambiente
const requiredEnvVars = [
    'PORT',
    'NODE_ENV',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CERT_PATH'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

const DEFAULT_FIREBASE_CERT_PATH = './firebase-cert.json';

module.exports = {
    port: process.env.PORT || 3000,
    firebase: {
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        projectId: process.env.FIREBASE_PROJECT_ID,
        credential: require(process.env.FIREBASE_CERT_PATH || DEFAULT_FIREBASE_CERT_PATH),
    },
    nodeEnv: process.env.NODE_ENV || 'development'
};