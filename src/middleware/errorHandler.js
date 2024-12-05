// Classe customizada para erros da aplicação
class AppError extends Error {
    constructor(message, statusCode, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Tratamento de erros específicos do Multer
const handleMulterError = (err) => {
    return new AppError(err.message, 400);
};

// Tratamento de erros do Firebase
const handleFirebaseError = (err) => {
    // Códigos específicos do Firebase
    const firebaseErrors = {
        'storage/unauthorized': new AppError('Não autorizado para acessar o storage', 403),
        'storage/quota-exceeded': new AppError('Quota de armazenamento excedida', 429),
        'storage/invalid-checksum': new AppError('O arquivo está corrompido', 400),
        'storage/canceled': new AppError('Upload cancelado', 400)
    };

    return firebaseErrors[err.code] || new AppError('Erro no serviço de storage', 500);
};

// Middleware principal de tratamento de erros
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            details: err.details,
            stack: err.stack
        });
    }

    // Ambiente de produção
    if (err.isOperational) {
        // Erros operacionais conhecidos
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(err.details && { details: err.details })
        });
    }

    // Tratamento específico para diferentes tipos de erro
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'MulterError') error = handleMulterError(err);
    if (err.code && err.code.startsWith('storage/')) error = handleFirebaseError(err);

    // Log do erro (você pode implementar um serviço de logging aqui)
    console.error('ERROR 💥', err);

    // Resposta genérica para erros não operacionais em produção
    return res.status(500).json({
        status: 'error',
        message: 'Algo deu errado!'
    });
};

module.exports = {
    AppError,
    errorHandler
};