const sequelize = require("sequelize")
const Sequelize = require("sequelize")

const connection = new Sequelize("usersnode", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection