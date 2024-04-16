const express = require('express')
const router = express.Router()
const authadmin = require('../middlewares/authadmin')

//MODEL
const Admin = require('./Admin')
const Usuario = require('../usuario/Usuario')

router.get('/painel',(request,response)=>{
    response.render('admin/painel',{
        usuario:request.session.admin.usuario
    })
})

router.post('/authenticateadmin',(request,response)=>{
    let usuario = request.body.usuario
    let senha = request.body.senha

    Admin.findOne({where:{usuario:usuario}}).then( user => {
        if(user != undefined){
            let correct = senha == user.senha

            if(correct){
                request.session.admin = {
                    id: user.id,
                    usuario: user.usuario,
                }
                response.redirect('/painel')
            }else{
                response.redirect('/admin')
            }
        }else{
            response.redirect('/admin')
        }
    })
})


router.get('/criar-usuario',authadmin,(request,response)=>{
    response.render('admin/criar-usuario')
})

router.post('/criar-usuario',authadmin,(request,response)=>{
    let usuario = request.body.usuario
    let senha = request.body.senha
    let usuariosip = request.body.usuariosip
    let senhasip = request.body.senhasip

    Usuario.create({
        usuario:usuario,
        senha:senha,
        usuariosip:usuariosip,
        senhasip:senhasip
    }).then(()=>{
        response.redirect('/painel')
    })
})

router.get('/adicionar-saldo',authadmin,(request,response)=>{
    response.render('admin/adicionar-saldo')
})

router.post('/adicionar-saldo',authadmin,(request,response)=>{
    let usuario = request.body.usuario
    let saldo = request.body.saldo
    
    Usuario.update({saldo:saldo},{
        where:{
            usuario:usuario
        }
    }).then(()=>{
        response.redirect('/painel')
    }).catch((error)=>{
        response.redirect('/painel')
    })

    
})


router.get('/logoutadmin',authadmin,(request,response)=>{
    request.session.admin = undefined

    response.redirect('/painel')
})

module.exports = router