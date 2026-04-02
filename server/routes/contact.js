const express = require('express');
const { body, validationResult } = require('express-validator');

const router = express.Router();

/** Messages contact stockés en mémoire log (production: envoi email / ticket) */
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 120 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('subject').trim().isLength({ min: 3, max: 200 }).escape(),
    body('message').trim().isLength({ min: 10, max: 5000 }).escape(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // En production : intégrer nodemailer ou file d'attente
    return res.status(201).json({
      message: 'Votre message a été enregistré. Une réponse vous sera adressée sous réserve des délais institutionnels.',
    });
  }
);

module.exports = router;
