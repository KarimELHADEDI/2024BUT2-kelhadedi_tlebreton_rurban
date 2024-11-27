async function getId(id) {
    const sql = "SELECT * FROM produit WHERE id = ?";
    return new Promise((resolve, reject) => {
        bdd.query(sql, id, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results[0]); // Retourner l'utilisateur unique (premier résultat)
        });
        console.log(results)
    });
}