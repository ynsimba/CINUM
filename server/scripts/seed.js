require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

async function run() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Définissez DATABASE_URL dans server/.env');
    process.exit(1);
  }

  const updatePasswords = ['1', 'true', 'yes', 'on'].includes(
    String(process.env.SEED_UPDATE_PASSWORDS || '').toLowerCase()
  );

  const email = process.env.SEED_ADMIN_EMAIL || 'admin@cinum-rdc.local';
  const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMoi2026!Securise';
  const hash = await bcrypt.hash(password, 12);

  let admin = await prisma.user.findUnique({ where: { email } });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        name: 'Administrateur',
        role: 'admin',
      },
    });
    console.log('Compte administrateur créé:', email);
  } else if (updatePasswords) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash: hash },
    });
    console.log('Mot de passe administrateur réinitialisé:', email);
  } else {
    console.log(
      'Administrateur déjà présent:',
      email,
      '(mot de passe inchangé — ajoutez SEED_UPDATE_PASSWORDS=true dans server/.env puis relancez le seed pour appliquer SEED_ADMIN_PASSWORD)'
    );
  }

  const modEmail = process.env.SEED_MOD_EMAIL || 'moderateur@cinum-rdc.local';
  const modPass = process.env.SEED_MOD_PASSWORD || 'Moderateur2026!';
  const modHash = await bcrypt.hash(modPass, 12);
  let mod = await prisma.user.findUnique({ where: { email: modEmail } });
  if (!mod) {
    mod = await prisma.user.create({
      data: {
        email: modEmail,
        passwordHash: modHash,
        name: 'Modérateur',
        role: 'moderator',
      },
    });
    console.log('Compte modérateur créé:', modEmail);
  } else if (updatePasswords) {
    await prisma.user.update({
      where: { id: mod.id },
      data: { passwordHash: modHash },
    });
    console.log('Mot de passe modérateur réinitialisé:', modEmail);
  } else {
    console.log('Modérateur déjà présent:', modEmail);
  }

  const count = await prisma.article.count();
  if (count === 0 && admin) {
    await prisma.article.create({
      data: {
        title: 'Introduction au civisme numérique',
        slug: 'introduction-civisme-numerique',
        excerpt: 'Principes généraux pour un usage responsable des technologies en RDC.',
        content:
          "Ce portail s'inscrit dans le cadre de la loi n° 20/017 relative aux télécommunications et aux TIC. Il vise à informer les citoyens sur leurs droits et devoirs, et à prévenir les abus numériques. Les contenus sont à vocation pédagogique et ne remplacent pas une consultation juridique personnalisée.",
        category: 'education',
        published: true,
        authorId: admin.id,
      },
    });
    await prisma.news.create({
      data: {
        title: 'Lancement du portail national de civisme numérique',
        excerpt: 'Une initiative pour renforcer la culture du numérique responsable.',
        content:
          "Cette plateforme expérimentale illustre une démarche institutionnelle de sensibilisation, en cohérence avec les missions de régulation et d'information du public.",
        alert: false,
        campaign: true,
        published: true,
      },
    });
    await prisma.lawReference.create({
      data: {
        title: 'Loi relative aux télécommunications et aux TIC',
        reference: 'Loi n° 20/017',
        summary:
          'Cadre légal des communications électroniques, des infrastructures et des services TIC en République démocratique du Congo. Ce texte structure notamment les obligations des opérateurs et les pouvoirs de régulation.',
        fullTextUrl: '',
        published: true,
      },
    });
    console.log('Données de démonstration insérées.');
  }

  await prisma.$disconnect();

  console.log('');
  console.log('══════════════════════════════════════════════════════════');
  console.log('  Identifiants — espace administration / modération (/admin)');
  console.log('══════════════════════════════════════════════════════════');
  console.log('');
  console.log('  Rôle administrateur (tous droits, y compris suppressions)');
  console.log('    Courriel      :', email);
  console.log('    Mot de passe  :', password);
  console.log('');
  console.log('  Rôle modérateur (rédaction, signalements ; suppressions limitées)');
  console.log('    Courriel      :', modEmail);
  console.log('    Mot de passe  :', modPass);
  console.log('');
  console.log('  Connexion web   : /connexion (depuis la barre du site)');
  console.log('');
  console.log('  (Définissez SEED_* dans server/.env pour personnaliser. En production,');
  console.log('   utilisez des mots de passe forts et ne commitez pas le fichier .env.)');
  console.log('══════════════════════════════════════════════════════════');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
