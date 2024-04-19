const Sequelize = require('sequelize')
const connection = require('../database/database')

const Usuario = connection.define('usuarios',{
    usuario:{
        type: Sequelize.STRING,
        allowNull:true
    },
    senha:{
        type: Sequelize.STRING,
        allowNull:true
    },
    saldo:{
        type: Sequelize.STRING,
        allowNull:true
    },
    ultimogasto:{
        type: Sequelize.STRING,
        allowNull:true
    },
    usuariosip:{
        type: Sequelize.STRING,
        allowNull:true
    },
    senhasip:{
        type: Sequelize.STRING,
        allowNull:true
    },
    saldoinicialsemacrecimo:{
        type: Sequelize.STRING,
        allowNull:true
    },
    saldoinicialcomacrecimo:{
        type: Sequelize.STRING,
        allowNull:true
    }
})

Usuario.sync({force:false}).then(()=>{
    console.log('tabela usuario criada')
})
module.exports = Usuario