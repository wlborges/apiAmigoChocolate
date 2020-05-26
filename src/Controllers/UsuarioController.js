const Usuario = require('../Models/Usuario');
const cripto= require('../middleware/cripto');
const token_email = require('../middleware/token_email');
const envio_email = require('../middleware/envio_email');

module.exports={
    async index(request,response){
        const {page=1}=request.query;
        const UsuarioRetorno=await Usuario.paginate({},{page,limit:5});
        return response.json(UsuarioRetorno);
    },
    async getUsuario(request,response){
        const _id=request.user._id;
        const UsuarioRetorno = await Usuario.find({_id:_id});
        const user=UsuarioRetorno[0];
        return response.json({nome:user.nome,email:user.email,dataNascimento:user.dataNascimento});
    },
    async create(request,response){
        let { nome,email,senha,dataNascimento }=request.body;
        let criptosenha = cripto.criptografia(senha);
        let token = token_email.token();
        const validaEmail = await Usuario.find({email:email});
        if(validaEmail.length==0){
            const UsuarioRetorno = await Usuario.create({
                nome,
                email,
                senha:criptosenha,
                dataNascimento,
                status:true,
                verificado: false,
                token
            });
            envio_email.verificacao(email, token)
            return response.json({status:true,msg:'Usuário cadastrado com sucesso! Verifique seu email!'});
            
        }
        else if(!validaEmail[0].status){
            const ativarRetorno = await Usuario.updateOne({email:email},{$set:{status:true}});
            response.json({status:false,msg:'Seja bem vindo novamente, faça login!'});
        }else{
            response.json({status:false,msg:'Email cadastrado, faça login!'});
        }
    },

    async verificar_email(request,response){
        let {token}=request.body;

        try{
            const UsuarioRetorno=await Usuario.updateOne({token},{$set:{verificado: true, token: ""}});
            if(UsuarioRetorno.n==0){
                return response.json({status:false,msg:"Link incorreto"});
            }else{
                return response.json({status:true,msg:'Email verificado com sucesso!'});
            }
        }catch{
            return response.json({staus:false,msg:'Erro de comunicação com o servidor!'});
        }
    },

    async edit(request,response){
        let {nome,email,dataNascimento}=request.body;

        try{
            const UsuarioRetorno=await Usuario.updateOne({email:email},{$set:{nome:nome,dataNascimento:dataNascimento}});
            console.log(UsuarioRetorno);
            if(UsuarioRetorno.n==0){
                return response.json({status:false,msg:"Usuário não encontrado"});
            }else{
                return response.json({status:true,msg:'Dados atualizados com sucesso!'});
            }
        }catch{
            return response.json({staus:false,msg:'Erro de comunicação com o servidor!'});
        }
    },

    async editSenha(request,response){
        let {senhaAntiga,novaSenha}=request.body;

        const _id=request.user._id;
        const UsuarioRetorno=await Usuario.updateOne({_id:_id,senha:senhaAntiga},{$set:{senha:novaSenha}});
        console.log(UsuarioRetorno);
        console.log(UsuarioRetorno.nModified);

        if(UsuarioRetorno.n==0){
            return response.json({staus:false,msg:'Senha incorreta!'});
        }else if(UsuarioRetorno.n==1 & UsuarioRetorno.nModified==0){
            return response.json({staus:false,msg:'Nova senha igual a senha anterior!'});
        }
        else{
            return response.json({staus:true,msg:'Senha alterada com sucesso!'});
        }
    },

    async delete(request,response){
        const _id=request.user._id;
        try {
            const UsuarioRetorno=await Usuario.updateOne({_id:_id},{$set:{status:false}});
            return response.json({staus:true,msg:'Usuário desativado com secesso!'});
            
        } catch (error) {
            return response.json({status:false,msg:'Erro de comunicação com o servidor!'});
        }
    },
}
