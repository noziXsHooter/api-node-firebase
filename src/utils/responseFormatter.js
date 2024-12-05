/**
 * Formata a resposta da API de maneira padronizada
 * @param {string} message - Mensagem descritiva da resposta
 * @param {object|null} data - Dados a serem retornados (opcional)
 * @param {boolean} success - Indica se a operação foi bem-sucedida
 * @param {object|null} meta - Metadados adicionais (opcional)
 * @returns {object} Resposta formatada
 */
const formatResponse = (message, data = null, success = true, meta = null) => {
    const response = {
        success,
        message,
        timestamp: new Date().toISOString()
    };

    if (data !== null) {
        response.data = data;
    }

    if (meta !== null) {
        response.meta = meta;
    }

    return response;
};

/**
 * Formata uma resposta de erro
 * @param {string} message - Mensagem de erro
 * @param {number} statusCode - Código HTTP do erro
 * @param {object|null} details - Detalhes adicionais do erro (opcional)
 * @returns {object} Erro formatado
 */
const formatError = (message, statusCode = 500, details = null) => {
    const response = {
        success: false,
        message,
        statusCode,
        timestamp: new Date().toISOString()
    };

    if (details !== null) {
        response.details = details;
    }

    return response;
};

/**
 * Formata uma resposta de paginação
 * @param {Array} data - Dados a serem retornados
 * @param {number} page - Página atual
 * @param {number} limit - Limite de itens por página
 * @param {number} total - Total de itens
 * @param {string} message - Mensagem descritiva (opcional)
 * @returns {object} Resposta paginada formatada
 */
const formatPagination = (data, page, limit, total, message = 'Dados recuperados com sucesso') => {
    const totalPages = Math.ceil(total / limit);
    
    return {
        success: true,
        message,
        data,
        meta: {
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        },
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    formatResponse,
    formatError,
    formatPagination
};