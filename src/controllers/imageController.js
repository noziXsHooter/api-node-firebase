const StorageService = require('../services/storageService');
const { formatResponse, formatError } = require('../utils/responseFormatter');

class ImageController {
    constructor() {
        this.storageService = new StorageService();
    }

    async uploadImage(req, res) {
        try {
            const file = req.file;
            const url = await this.storageService.uploadFile(file);
            res.json(formatResponse('Upload realizado com sucesso!', { url }));
        } catch (error) {
            res.status(error.statusCode || 500).json(
                formatError(error.message, error.statusCode)
            );
        }
    }

    async getImages(req, res) {
        try {
            const urls = await this.storageService.listFiles();
            res.json(formatResponse('Images retrieved successfully', { urls }));
        } catch (error) {
            res.status(error.statusCode || 500).json(
                formatError(error.message, error.statusCode)
            );
        }
    }

    async makePublic(req, res) {
        try {
            const count = await this.storageService.makeFilesPublic();
            res.json(formatResponse('All files are now public', { count }));
        } catch (error) {
            res.status(error.statusCode || 500).json(
                formatError(error.message, error.statusCode)
            );
        }
    }
}

module.exports = new ImageController();