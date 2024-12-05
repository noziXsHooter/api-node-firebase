const { initializeFirebase } = require('../config/firebase.config');
const { AppError } = require('../middleware/errorHandler');

class StorageService {
    constructor() {
        this.bucket = initializeFirebase();
    }

    async uploadFile(file) {
        // Validação básica do arquivo
        if (!file) {
            throw new AppError('Nenhum arquivo foi enviado', 400);
        }

        // Validação do tipo de arquivo (exemplo)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new AppError(
                'Tipo de arquivo não suportado',
                400,
                { allowedTypes }
            );
        }

        try {
            const blob = this.bucket.file(`mastore/images/${file.originalname}`);

            return new Promise((resolve, reject) => {
                const blobStream = blob.createWriteStream();

                blobStream.on('error', (error) => {
                    reject(new AppError(
                        'Erro ao fazer upload do arquivo',
                        500,
                        { originalError: error.message }
                    ));
                });

                blobStream.on('finish', async () => {
                    try {
                        await blob.makePublic();
                        const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`;
                        resolve(publicUrl);
                    } catch (error) {
                        reject(new AppError(
                            'Erro ao tornar o arquivo público',
                            500,
                            { originalError: error.message }
                        ));
                    }
                });

                blobStream.end(file.buffer);
            });
        } catch (error) {
            throw new AppError(
                'Erro no serviço de storage',
                500,
                { originalError: error.message }
            );
        }
    }

    async listFiles() {
        try {
            const [files] = await this.bucket.getFiles({ prefix: 'mastore/images/' });
            if (!files.length) {
                throw new AppError('Nenhuma imagem encontrada', 404);
            }

            return files.map(file =>
                `https://storage.googleapis.com/${this.bucket.name}/${file.name}`
            );
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(
                'Erro ao listar arquivos',
                500,
                { originalError: error.message }
            );
        }
    }

    async makeFilesPublic() {
        try {
            const [files] = await this.bucket.getFiles({
                prefix: 'mastore/images/'
            });

            if (!files.length) {
                throw new AppError('Nenhum arquivo encontrado para tornar público', 404);
            }

            const makePublicPromises = files.map(file => file.makePublic());
            await Promise.all(makePublicPromises);

            return files.length;
        } catch (error) {
            if (error instanceof AppError) throw error;

            throw new AppError(
                'Erro ao tornar arquivos públicos',
                500,
                { originalError: error.message }
            );
        }
    }
}

module.exports = StorageService;