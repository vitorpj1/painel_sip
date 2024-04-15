function auth(request,response,next){
    if(request.session.usuario != undefined){
        next()
    }else{
        response.redirect('/login')
    }
}

module.exports = auth