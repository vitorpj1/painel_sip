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
        let saldoinicialcomacrecimo = usuariodb.saldoinicialcomacrecimo
        let saldoinicialbanco = usuariodb.saldoinicialsemacrecimo
        let saldoinicialsemacrecimo = parseFloat(saldoinicialbanco)

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
    await page.waitForSelector(".row-stat-value");
    let rows = await page.$$eval('.row-stat-value', el => el.map(data => data.innerHTML))
    await sleep(1000);
    await browser.close();
    let element = rows[1]

    

    let saldo = element.replace('$','').replace(' ','')
    let saldoeditadoo =  saldo.replace('.','').replace(',','.')
    let api = parseFloat(saldoeditadoo)   
    
    //VERIFICA SE O SALDO É NEGATIVO
    if(api < 0){
        response.redirect('/saldo-insuficiente') 
    }else{

        //api
        //apimais
        let apimais = (api + (api * 0.3333)).toFixed(2)
        //saldogasto
        let saldogasto = (parseFloat(saldoinicialsemacrecimo) - api)
        //saldogasto60
        let saldogasto60 = saldogasto + ( saldogasto * 0.6666)
        //diferencasaldo
        let diferencasaldo = parseFloat((apimais - saldogasto60 )) 
        //saldoparaexibir
        let saldoparaexibir = diferencasaldo
        saldoparaexibir.toFixed(2)
        response.render('home',{
            api:api,
            saldoparaexibir:saldoparaexibir,
            saldoinicialsemacrecimo: saldoinicialsemacrecimo
        })        
    }
})();
})

router.get('/saldo-insuficiente',(request,response)=>{
    response.render('saldo-insuficiente')
})

router.get('/logout',auth,(request,response)=>{
    request.session.usuario = undefined

    response.redirect('/')
})



module.exports = router