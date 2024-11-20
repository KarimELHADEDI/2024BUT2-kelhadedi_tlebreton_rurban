const bdd = require("./database.js");

async function getUserById(id) {
    const sql = "SELECT * FROM utilisateur WHERE id = ?";
    return new Promise((resolve, reject) => {
        bdd.query(sql, id, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

async function checkLogin(login) {
    sql = "SELECT * FROM utilisateur WHERE login = ?"
    return new Promise((resolve, reject) => {
        bdd.query(sql, login, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results)
        });
    });

};

async function createUser(user) {
    const sql = "INSERT INTO utilisateur (username, password, lastname, firstname, birthdate, email) VALUES (?, ?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
        bdd.query(sql, [username, password, lastname, firstname, birthdate, email], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results)
        });
    });

};

module.exports = { getUserById, checkLogin, createUser };
