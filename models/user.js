const bdd = require("./database.js");

// Récupérer un utilisateur par ID
async function getUserById(id) {
    const sql = "SELECT * FROM utilisateur WHERE id = ?";
    return new Promise((resolve, reject) => {
        bdd.query(sql, id, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]); // Retourner l'utilisateur unique (premier résultat)
        });
    });
}

// Vérifier le login de l'utilisateur
async function checkLogin(login) {
    const sql = "SELECT * FROM utilisateur WHERE login = ?";
    return new Promise((resolve, reject) => {
        bdd.query(sql, login, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]); // Retourner l'utilisateur unique (premier résultat)
        });
    });
}

// Créer un utilisateur
async function createUser(user) {
    const sql = "INSERT INTO utilisateur (login, password, nom, prenom, ddn, email, type_utilisateur) VALUES (?, ?, ?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
        bdd.query(
            sql,
            [user.login, user.password, user.lastname, user.firstname, user.birthdate, user.email, "client"],
            (err, results) => {
                if (err) {
                    console.error("Erreur dans createUser:", err); // Log détaillé
                    return reject(err);
                }
                resolve(results.insertId); // Retourner l'ID de l'utilisateur inséré
            }
        );
    });
}

// Exporter les fonctions
module.exports = {
    getUserById,
    checkLogin,
    createUser,
};
