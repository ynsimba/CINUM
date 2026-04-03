const express = require('express');
const { body, validationResult } = require('express-validator');
const contactService = require('../services/contactService');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 120 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('subject').trim().isLength({ min: 3, max: 200 }).escape(),
    body('message').trim().isLength({ min: 10, max: 5000 }).escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      await contactService.create({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
      });
      return res.status(201).json({
        message: 'Votre message a été enregistré. Une réponse vous sera adressée sous réserve des délais institutionnels.',
      });
    } catch (e) {
      console.error('[contact]', e);
      return res.status(500).json({ error: 'Enregistrement impossible.' });
    }
  }
);

module.exports = router;
