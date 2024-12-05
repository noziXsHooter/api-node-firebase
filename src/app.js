const express = require('express');
const config = require('./config/env.config');
const { errorHandler } = require('./middleware/errorHandler');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('../public'));

// Rotas
app.use('/api', imageRoutes);

// Error handler deve ser o último middleware
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Servidor rodando na porta ${config.port} em modo ${config.nodeEnv}`);
});

module.exports = app;





// // server.js
// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const { initializeApp } = require('firebase/app');
// //const { getAnalytics } = require("firebase/analytics");
// const { getStorage, ref, uploadBytes, listAll, getDownloadURL } = require('firebase/storage');

// const app = express();
// const upload = multer({ storage: multer.memoryStorage() });

// var admin = require("firebase-admin");

// var serviceAccount = require("./config/firebase-cert.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     storageBucket: "images.firebasestorage.app",
// });

// //const firebaseApp = initializeApp(firebaseConfig);
// //const analytics = getAnalytics(firebaseApp);
// //const storage = getStorage(firebaseApp);

// const bucket = admin.storage().bucket();

// app.use(express.static('public'));

// app.post('/upload', upload.single('image'), async (req, res) => {
//     try {
//         const file = req.file;
//         const blob = bucket.file(`mastore/images/${file.originalname}`);
//         const blobStream = blob.createWriteStream();

//         blobStream.on('error', (error) => {
//             res.status(500).json({ error: error.message });
//         });

//         blobStream.on('finish', async () => {
//             await blob.makePublic();
//             const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
//             res.json({
//                 message: 'Upload realizado com sucesso!',
//                 url: publicUrl
//             });
//         });

//         blobStream.end(req.file.buffer);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.get('/images', async (req, res) => {
//     try {
//         const [files] = await bucket.getFiles({ prefix: 'mastore/images/' });
//         const urls = files.map(file =>
//             `https://storage.googleapis.com/${bucket.name}/${file.name}`
//         );
        
//         // res.json(urls);
//         // const listRef = ref(storage, 'images');
//         // const list = await listAll(listRef);
//         // const urls = await Promise.all(
//         //     list.items.map(item => getDownloadURL(item))
//         // );
//         res.json(urls);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.post('/make-public', async (req, res) => {
//     try {
//         const [files] = await bucket.getFiles({
//             prefix: 'mastore/images/'
//         });

//         const makePublicPromises = files.map(file => file.makePublic());
//         await Promise.all(makePublicPromises);

//         res.json({
//             message: 'All files in mastore/images are now public',
//             count: files.length
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(3000, () => console.log('Servidor rodando na porta 3000'));