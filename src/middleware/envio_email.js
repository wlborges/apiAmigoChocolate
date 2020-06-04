const axios = require('axios');

async function verificacao(email, token){
    const retorno = await axios.post('https://emailautomatico.herokuapp.com/send',
                    {   
                        to:email, 
                        subject: 'Valide seu Cadastro - Amigo Chocolate',
                        html:`<h1>Amigo Chocolate</h1><p><a href='https://amigochocolate.netlify.app/?token=${token}'>Clique aqui</a> para validar seu cadastro. Caso o link não funcione, cole o endereço abaixo no navegador: <br /><b>https://amigochocolate.netlify.app/?token=${token} </b></p>`
                    }
                )

}
async function convite(email, user, grupo){
    const retorno = await axios.post('https://emailautomatico.herokuapp.com/send',
    {   
        to:email, 
        subject: 'Convite Amigo Chocolate',
        html:`<h1>Amigo Chocolate</h1><p>${user.nome} (${user.email}) te convidou para participar do ${grupo}. <a href='amigochocolate.netlify.app'>Clique aqui </a> para fazer seu cadastro</p>`
    })
    return true;
}
module.exports = {verificacao, convite};