const Sequelize = require('sequelize')
const connection = require('../database/database')

const Usuario = connection.define('usuarios',{
    usuario:{
        type: Sequelize.STRING,
        allowNull:false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull:false
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
        allowNull:false
    },
    senhasip:{
        type: Sequelize.STRING,
        allowNull:false
    },
    saldoinicialsemacrecimo:{
        type: Sequelize.STRING,
        allowNull:false
    },
    saldoinicialcomacrecimo:{
        type: Sequelize.STRING,
        allowNull:false
    }
})

Usuario.sync({force:false}).then(()=>{
    console.log('tabela usuario criada')
})
module.exports = Usuario