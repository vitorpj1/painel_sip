const Sequelize = require('sequelize')

const connection = new Sequelize('db_sip','root','1234',{
    host:'localhost',
    dialect: 'mysql'
})

module.exports = connection