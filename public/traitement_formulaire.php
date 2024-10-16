<?php
// Chemin vers votre base de données SQLite
$db_path = 'database.sqlite';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer et nettoyer les données du formulaire
    $nom = htmlspecialchars(trim($_POST['nom']));
    $email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
    $sujet = htmlspecialchars(trim($_POST['sujet']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Vérifier que toutes les données nécessaires sont présentes
    if ($nom && $email && $sujet && $message) {
        try {
            // Connexion à la base de données SQLite
            $db = new PDO("sqlite:$db_path");
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Préparer la requête d'insertion
            $stmt = $db->prepare("INSERT INTO contacts (nom, email, sujet, message) VALUES (:nom, :email, :sujet, :message)");
            $stmt->bindParam(':nom', $nom);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':sujet', $sujet);
            $stmt->bindParam(':message', $message);

            // Exécuter la requête
            $stmt->execute();
            echo "Merci, votre message a été enregistré avec succès.";
        } catch (PDOException $e) {
            // Gérer les erreurs de base de données
            echo "Erreur : " . $e->getMessage();
        }
    } else {
        echo "Veuillez remplir tous les champs du formulaire correctement.";
    }
} else {
    echo "Méthode non autorisée.";
}
?>
