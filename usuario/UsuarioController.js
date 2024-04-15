const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')

const pup = require('puppeteer');

//MODEL
const Usuario = require('./Usuario')

//ROUTES
router.get('/login',(request,response)=>{
    response.render('login')
})

router.post('/authenticate',(request,response)=>{
    let usuario = request.body.usuario
    let senha = request.body.senha

    Usuario.findOne({where:{usuario:usuario}}).then( user => {
        if(user != undefined){
            let correct = senha == user.senha

            if(correct){
                request.session.usuario = {
                    id: user.id,
                    usuario: user.usuario,
                    usuariosip: user.usuariosip,
                    senhasip: user.senhasip
                }
                response.redirect('/home')
            }else{
                response.redirect('/login')
            }
        }else{
            response.redirect('/login')
        }
    })
})

router.get('/home',auth,(request,response)=>{
    (async () =>{
        const url = "https://sip2.digitalvoxtelecom.com.br/security/login";
        const botao = "login";
        const sleep = ms => new Promise(res => setTimeout(res, ms));
        let usuario = request.session.usuario

        let usuariodb = await Usuario.findByPk(usuario.id)
        let saldodb = usuariodb.saldo
        let login = usuario.usuariosip
        let senha = usuario.senhasip

    const browser = await pup.launch(
        {
            headless:true
        }
    );
    const page = await browser.newPage();

    

    await page.goto(url);
   

    await sleep(2000);

    //LOGIN

    await page.waitForSelector("#username");
    await page.type("#username",login);

    await page.waitForSelector("#password");
    await page.type("#password",senha);

    //CLICOU
    await Promise.all([
        page.waitForNavigation(),
        page.click('#login')
    ])

    //ABRIU
    await page.waitForSelector(".green");
    let element = await page.$('.green')

    //pega o valor do saldo
    let value = await page.evaluate(el => el.textContent, element)

    let saldo = value.replace('$','').replace(' ','')
    let saldoConvertido = parseFloat(saldo)
    let novosaldo = Math.round(((saldoConvertido * 0.3333) + saldoConvertido)).toFixed(2).replace('.',',')

    //console.log('Saldo atual real: ' + saldo)
    //console.log('Saldo atual com 20% a mais: ' + novosaldo.toFixed(2))

    await sleep(1000);
    await browser.close();

    //console.log(saldo)


    response.render('home',{
        saldoapi:saldo,
        saldoeditado: novosaldo,
        saldodb:saldodb
    })
})();
})



router.get('/logout',auth,(request,response)=>{
    request.session.usuario = undefined

    response.redirect('/')
})



module.exports = router