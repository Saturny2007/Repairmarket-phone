// mailer.js
const nodemailer = require('nodemailer');

// Configurez le transporteur
const transporter = nodemailer.createTransport({
    service: 'gmail', // Utilisez 'gmail' ou un autre service
    auth: {
        user: 'votre_email@gmail.com', // Remplacez par votre adresse email
        pass: 'votre_mot_de_passe' // Remplacez par votre mot de passe ou un mot de passe d'application
    }
});

// Fonction pour envoyer l'email
const sendResetEmail = (to, resetLink) => {
    const mailOptions = {
        from: 'votre_email@gmail.com',
        to: to,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
