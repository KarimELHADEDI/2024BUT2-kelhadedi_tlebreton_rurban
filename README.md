# 2024BUT2-kelhadedi_tlebreton_rurban

## Ajouts après "oral"
- Ajout d'icones/liens, qui redirigent vers les pages `agentCrea.ejs` et `gestionloc.ejs` pour simplifier la navigation. Certaines icônes sont disponibles uniquement pour certains rôles/utilisateurs.
- Modification du fichier `header.style.css` pour rendre la barre de navigation plus lisible.
- Les pages `agentCrea.ejs` et `gestionloc.ejs` sont respectivement accessibles uniquement par les `admin` et par les `admin` ainsi que les `agent`.

## Présentation du travail
Dans notre équipe, nous devions réaliser un site de location de matériel sportif, lors de la conception UX/UI nous devions nous baser sur le persona de Jacques Février. 
Après la création de la maquette, nous devions créer le site web avec node.js, ce document a pour but de présenter les problèmes et les solutions trouvées.

### Problèmes rencontrés
- Problèmes de synchronisations sur le GitHub lors des push/pull.
- Gestion des bases de données pour la page `gestionloc.ejs`, car il y'a eu des problèmes lors du mélange du tableau `location` et du tableau `produit`.
- Pas de produits dans la base de données `produit`.

### Solutions
- Ajouter des produits dans la base de données `produit`, voici le code à injecter en SQL si besoin (nécessaire pour afficher des produits sur le site web) : 

```sql
INSERT INTO `produit` (`id`, `type`, `description`, `marque`, `modele`, `prix_location`, `etat`)
VALUES
(1, 'musculation', 'Presse à cuisses professionnelle', 'Technogym', 'Leg Press 500', 25.00, 'Disponible'),
(2, 'musculation', 'Haltères ajustables (2-24kg)', 'Bowflex', 'SelectTech 552', 10.00, 'Disponible'),
(3, 'musculation', 'Banc de musculation inclinable', 'Domyos', 'BA530', 15.00, 'Réparations en cours'),
(4, 'musculation', 'Cage à squat avec barre', 'Rogue', 'Monster Lite', 30.00, 'Disponible'),
(5, 'musculation', 'Machine à abdominaux', 'Matrix', 'G3-S70', 20.00, 'Disponible'),
(6, 'musculation', 'Machine à pectoraux', 'Panatta', 'Chest Press', 22.50, 'Disponible'),
(7, 'tapisdc', 'Tapis de course motorisé', 'NordicTrack', 'Commercial 1750', 40.00, 'Disponible'),
(8, 'tapisdc', 'Tapis de course pliable', 'ProForm', 'City L6', 25.00, 'Réparations en cours'),
(9, 'tapisdc', 'Tapis de course de bureau', 'LifeSpan', 'TR1200-DT5', 35.00, 'Disponible'),
(10, 'tapisdc', 'Tapis de course ultra-compact', 'Domyos', 'Walk500', 18.00, 'Disponible'),
(11, 'tapisdc', 'Tapis de course inclinable', 'Sole Fitness', 'F85', 45.00, 'Disponible'),
(12, 'velo', 'Vélo d\'intérieur connecté', 'Peloton', 'Bike+', 50.00, 'Disponible'),
(13, 'velo', 'Vélo de spinning', 'Keiser', 'M3i', 40.00, 'Disponible'),
(14, 'velo', 'Vélo d\'appartement magnétique', 'Domyos', 'EB500', 20.00, 'Réparations en cours'),
(15, 'velo', 'Vélo semi-allongé', 'Schwinn', '270 Recumbent', 30.00, 'Disponible'),
(16, 'velo', 'Vélo de course intérieur', 'Wahoo', 'KICKR Bike', 55.00, 'Disponible'),
(17, 'velo', 'Vélo elliptique', 'ProForm', 'Hybrid Trainer XT', 35.00, 'Disponible'),
(18, 'musculation', 'Smith Machine', 'Marcy', 'Diamond Elite', 50.00, 'Disponible'),
(19, 'tapisdc', 'Tapis de course électrique', 'Reebok', 'Jet 300+', 30.00, 'Disponible'),
(20, 'musculation', 'Rack de musculation complet', 'Body-Solid', 'GPR400', 45.00, 'Disponible');
```


## Répartition des pages/tâches lors du projet

### EL HADEDI Karim

- Création des fichiers index et CSS pour le footer, la page de connexion (login) et la page d'inscription (register).
- Principalement, la gestion des utilisateurs avec les fonctionnalités de connexion (login) et d'inscription (register), ainsi que leur intégration avec la base de données via le fichier user.js.
- La plus grande page que j'ai réalisée, et sur laquelle j'ai rencontré quelques problèmes, est la page panier, notamment concernant le lien avec la base de données.

### LE BRETON Tom

- Page produit (front + back)
- Gestion des locations
- Début de page panier (pas fini suite à de nombreux problème)
- Lien entre page catalogue et produit

### URBAN Ruben
- Landing page `index.ejs`
- Navbar `nav.ejs`
- Page catalogue (avec gestion des types de machine) `catalogue.ejs`
- Page ajout de produit `productAdd.ejs`
- Page de création d'agent `agentCrea.ejs`

