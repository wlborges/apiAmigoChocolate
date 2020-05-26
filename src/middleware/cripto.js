const crypto = require('crypto');

const dados_criptografar = {
    algoritmo : "aes256",
    codificacao : "utf8",
    //segrdo: process.env.CRIPTO_KEY
    segredo: "Inverno@2020",
    tipo : "hex"
}

function criptografia(senha){
    const cipher = crypto.createCipher(dados_criptografar.algoritmo, dados_criptografar.segredo);
    cipher.update(senha);
    return cipher.final(dados_criptografar.tipo);
}

function descriptografia(senha){
    const decipher = crypto.createDecipher(dados_criptografar.algoritmo,dados_criptografar.segredo);
    decipher.update(senha, dados_criptografar.tipo);
    return decipher.final();
}
module.exports = {criptografia, descriptografia}

/*
front criptografa
back salvar criptografado no banco
*/