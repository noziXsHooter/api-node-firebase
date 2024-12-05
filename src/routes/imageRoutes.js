const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../middleware/upload');

// Corrigindo as rotas
router.post('/upload', upload.single('image'), (req, res) => imageController.uploadImage(req, res));
router.get('/images', (req, res) => imageController.getImages(req, res));
router.post('/make-public', (req, res) => imageController.makePublic(req, res));

module.exports = router;