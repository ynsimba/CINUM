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

  if (admin) {
    const strategicArticles = [
      {
        title: 'Civisme numérique et souveraineté nationale en RDC',
        slug: 'civisme-numerique-et-souverainete-nationale-rdc',
        excerpt:
          "Pourquoi l'éducation au civisme numérique est devenue un impératif de sécurité nationale, de cohésion sociale et de développement durable.",
        category: 'institution',
        content:
          "La République Démocratique du Congo fait face à une transformation rapide de son environnement informationnel et technologique. Les menaces ne se limitent plus aux espaces physiques: elles se développent aussi dans le cyberespace, où circulent la désinformation, la fraude, les manipulations et les atteintes à la dignité humaine.\n\nCes dynamiques affectent directement la cohésion sociale, la confiance publique, l'économie numérique et, plus largement, la stabilité de la Nation. Dans ce contexte, le civisme numérique ne doit pas être perçu comme un simple module de sensibilisation: il constitue un levier stratégique de souveraineté.\n\nUn citoyen numériquement éduqué est mieux préparé à reconnaître les contenus trompeurs, à protéger ses données, à adopter des comportements responsables et à contribuer à un espace numérique plus sûr. À l'inverse, l'absence de culture numérique structurée ouvre des vulnérabilités exploitables par des acteurs malveillants.\n\nInvestir dans le civisme numérique aujourd'hui, c'est donc agir sur trois priorités nationales: la sécurité collective, la cohésion sociale et la capacité de développement durable dans un monde connecté. La protection de l'avenir passe par l'éducation de la jeunesse, l'encadrement des usages et la promotion de valeurs républicaines dans l'espace numérique.",
      },
      {
        title: 'Former, encadrer, protéger: le triptyque stratégique du portail CINUM',
        slug: 'former-encadrer-proteger-triptyque-cinum',
        excerpt:
          "Une approche complète pour prévenir les risques numériques, orienter les citoyens et sécuriser durablement l'espace informationnel.",
        category: 'education',
        content:
          "Face à la complexité des menaces numériques, une réponse uniquement répressive ne suffit pas. Le portail CINUM s'appuie sur un triptyque d'action publique complémentaire: former pour prévenir, encadrer pour orienter, protéger pour sécuriser.\n\nFormer pour prévenir: il s'agit de développer l'esprit critique, la compréhension des enjeux informationnels et la capacité à vérifier les contenus avant partage. Cette dimension réduit l'impact de la désinformation et des manipulations.\n\nEncadrer pour orienter: les citoyens, les familles, les écoles et les organisations ont besoin de repères clairs. L'encadrement repose sur des règles de conduite, des références juridiques accessibles et des dispositifs d'accompagnement pour les usages responsables.\n\nProtéger pour sécuriser: la protection implique des mécanismes concrets: signalement structuré, suivi des situations, sécurité des comptes et sensibilisation aux réflexes de cybersécurité. L'objectif est de réduire la vulnérabilité des personnes et des institutions.\n\nCe triptyque permet de passer d'une logique de réaction à une logique de résilience. Il donne à chaque acteur - citoyen, éducateur, administration, institution - un rôle actif dans la construction d'un environnement numérique fiable, éthique et sécurisé.",
      },
      {
        title: 'Jeunesse, résilience et valeurs républicaines à l’ère numérique',
        slug: 'jeunesse-resilience-et-valeurs-republicaines-numerique',
        excerpt:
          "Éduquer les jeunes au numérique responsable pour renforcer la résilience citoyenne et préserver les valeurs de la République.",
        category: 'societe',
        content:
          "La jeunesse congolaise grandit dans un espace numérique où l'information circule à grande vitesse. Cette réalité offre des opportunités majeures d'apprentissage, d'innovation et de participation citoyenne, mais expose aussi à des risques: harcèlement en ligne, fraude, manipulation, radicalisation informationnelle.\n\nL'enjeu n'est pas seulement technique. Il est civique et social. Former la jeunesse au civisme numérique, c'est lui donner des outils pour distinguer l'information fiable de la rumeur, pour agir avec responsabilité et pour respecter autrui dans les interactions numériques.\n\nLa résilience numérique se construit par des pratiques simples et constantes: vérifier les sources, protéger les identifiants, signaler les contenus graves, refuser les discours de haine et préserver la dignité humaine en ligne. Ces pratiques renforcent la confiance entre citoyens et soutiennent la stabilité collective.\n\nUne politique publique ambitieuse doit placer le civisme numérique au même niveau que l'éducation civique traditionnelle. En préparant les jeunes à relever les défis du XXIe siècle, la RDC consolide un capital citoyen stratégique: une population plus éclairée, plus responsable, plus sûre et plus engagée pour l'intérêt général.",
      },
    ];

    let insertedArticles = 0;
    for (const article of strategicArticles) {
      const exists = await prisma.article.findUnique({ where: { slug: article.slug } });
      if (!exists) {
        await prisma.article.create({
          data: {
            ...article,
            published: true,
            authorId: admin.id,
          },
        });
        insertedArticles += 1;
      }
    }

    const introSlug = 'introduction-civisme-numerique';
    const introExists = await prisma.article.findUnique({ where: { slug: introSlug } });
    if (!introExists) {
      await prisma.article.create({
        data: {
          title: 'Introduction au civisme numérique',
          slug: introSlug,
          excerpt: 'Principes généraux pour un usage responsable des technologies en RDC.',
          content:
            "Ce portail s'inscrit dans le cadre de la loi n° 20/017 relative aux télécommunications et aux TIC. Il vise à informer les citoyens sur leurs droits et devoirs, et à prévenir les abus numériques. Les contenus sont à vocation pédagogique et ne remplacent pas une consultation juridique personnalisée.",
          category: 'education',
          published: true,
          authorId: admin.id,
        },
      });
      insertedArticles += 1;
    }

    const demoNewsTitle = 'Lancement du portail national de civisme numérique';
    const demoNews = await prisma.news.findFirst({ where: { title: demoNewsTitle } });
    if (!demoNews) {
      await prisma.news.create({
        data: {
          title: demoNewsTitle,
          excerpt: 'Une initiative pour renforcer la culture du numérique responsable.',
          content:
            "Cette plateforme expérimentale illustre une démarche institutionnelle de sensibilisation, en cohérence avec les missions de régulation et d'information du public.",
          alert: false,
          campaign: true,
          published: true,
        },
      });
    }

    const lawRef = 'Loi n° 20/017';
    const demoLaw = await prisma.lawReference.findFirst({ where: { reference: lawRef } });
    if (!demoLaw) {
      await prisma.lawReference.create({
        data: {
          title: 'Loi relative aux télécommunications et aux TIC',
          reference: lawRef,
          summary:
            'Cadre légal des communications électroniques, des infrastructures et des services TIC en République démocratique du Congo. Ce texte structure notamment les obligations des opérateurs et les pouvoirs de régulation.',
          fullTextUrl: '',
          published: true,
        },
      });
    }

    if (insertedArticles > 0) {
      console.log(`Articles insérés: ${insertedArticles}`);
    } else {
      console.log('Articles stratégiques déjà présents (aucune insertion).');
    }
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
