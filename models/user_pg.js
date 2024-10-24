const bdd = require("./database.js");

async function getUserById(id) {
    const sql = "SELECT * FROM utilisateur WHERE id = $1";
    return new Promise((resolve, reject) => {
        bdd.query(sql, [id], (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results.rows[0]);
        });
    });
}

module.exports = { getUserById };
