function auth(request,response,next){
    if(request.session.admin != undefined){
        next()
    }else{
        response.render('admin/login')
    }
}

module.exports = auth