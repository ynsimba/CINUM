require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { User } = require('../models/User');
const Article = require('../models/Article');
const News = require('../models/News');
const LawReference = require('../models/LawReference');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Définissez MONGODB_URI dans server/.env');
    process.exit(1);
  }
  await mongoose.connect(uri);

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@cinum-rdc.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMoi2026!Securise';
  const hash = await bcrypt.hash(password, 12);

  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({
      email,
      passwordHash: hash,
      name: 'Administrateur',
      role: 'admin',
    });
    console.log('Compte administrateur créé:', email);
  } else {
    console.log('Administrateur déjà présent:', email);
  }

  const modEmail = process.env.SEED_MOD_EMAIL || 'moderateur@cinum-rdc.local';
  const modPass = process.env.SEED_MOD_PASSWORD || 'Moderateur2026!';
  const modHash = await bcrypt.hash(modPass, 12);
  let mod = await User.findOne({ email: modEmail });
  if (!mod) {
    await User.create({
      email: modEmail,
      passwordHash: modHash,
      name: 'Modérateur',
      role: 'moderator',
    });
    console.log('Compte modérateur créé:', modEmail);
  }

  const count = await Article.countDocuments();
  if (count === 0 && admin) {
    await Article.create({
      title: 'Introduction au civisme numérique',
      slug: 'introduction-civisme-numerique',
      excerpt: 'Principes généraux pour un usage responsable des technologies en RDC.',
      content:
        'Ce portail s\'inscrit dans le cadre de la loi n° 20/017 relative aux télécommunications et aux TIC. Il vise à informer les citoyens sur leurs droits et devoirs, et à prévenir les abus numériques. Les contenus sont à vocation pédagogique et ne remplacent pas une consultation juridique personnalisée.',
      category: 'education',
      published: true,
      author: admin._id,
    });
    await News.create({
      title: 'Lancement du portail national de civisme numérique',
      excerpt: 'Une initiative pour renforcer la culture du numérique responsable.',
      content:
        'Cette plateforme expérimentale illustre une démarche institutionnelle de sensibilisation, en cohérence avec les missions de régulation et d\'information du public.',
      alert: false,
      campaign: true,
      published: true,
    });
    await LawReference.create({
      title: 'Loi relative aux télécommunications et aux TIC',
      reference: 'Loi n° 20/017',
      summary:
        'Cadre légal des communications électroniques, des infrastructures et des services TIC en République démocratique du Congo. Ce texte structure notamment les obligations des opérateurs et les pouvoirs de régulation.',
      fullTextUrl: '',
      published: true,
    });
    console.log('Données de démonstration insérées.');
  }

  await mongoose.disconnect();
  console.log('Terminé. Mot de passe admin par défaut (à changer en production):', password);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
