const Usuario = require('../Models/Usuario');
const jwt = require('jsonwebtoken')
const cripto= require('../middleware/cripto');

module.exports={
    async geraToken(request,response){

        let{email,senha}=request.body;
        let criptosenha = cripto.criptografia(senha)
        const UsuarioRetorno = await Usuario.findOne({email,senha:criptosenha});

        
        if(!UsuarioRetorno){
            return response.json({auth:false,msg:"Usuario ou senha incorreta!!"});
        }
        else{
            if(UsuarioRetorno.status==false){
                return response.json({auth:false,msg:"Usuário desativado, registre-se novamente!!"});
            }else{
                const token = jwt.sign({email:UsuarioRetorno.email, senha:UsuarioRetorno.senha},process.env.JWT_KEY,{expiresIn:3000000000});
                return response.json({auth:true,token:token,nome:UsuarioRetorno.nome});
            }
           
        }
    }
}