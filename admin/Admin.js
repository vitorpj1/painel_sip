const Sequelize = require('sequelize')
const connection = require('../database/database')

const Admin = connection.define('admin',{
    usuario:{
        type: Sequelize.STRING,
        allowNull:false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull:false
    }
})

Admin.sync({force:false}).then(()=>{
    console.log('tabela criada')
})
module.exports = Admin