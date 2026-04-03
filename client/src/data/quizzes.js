/**
 * Quiz QCM — contenus pédagogiques civisme numérique (RDC).
 * correctOptionId doit correspondre à un id d’option pour chaque question.
 */

const VARIANT_LABELS = [
  'Cas pratique',
  'Situation',
  'Mise en contexte',
  'Application',
  'Scenario',
]

function rotateOptions(question, shift) {
  const options = question.options || []
  if (options.length === 0) return { options: [], correctOptionId: question.correctOptionId }
  const n = options.length
  const normalized = ((shift % n) + n) % n
  if (normalized === 0) {
    return { options: options.map((o) => ({ ...o })), correctOptionId: question.correctOptionId }
  }
  const rotated = options.map((_, i) => options[(i + normalized) % n]).map((o) => ({ ...o }))
  const correctIndexBefore = options.findIndex((o) => o.id === question.correctOptionId)
  const correctIndexAfter = (correctIndexBefore - normalized + n) % n
  return { options: rotated, correctOptionId: rotated[correctIndexAfter]?.id || question.correctOptionId }
}

function normalizePrompt(prompt, variantLabel, index) {
  const clean = String(prompt || '').trim().replace(/\s+/g, ' ')
  return `${clean} (${variantLabel} ${index})`
}

/**
 * Etend une banque de questions jusqu'a targetCount en reutilisant la base
 * avec permutations d'options + reformulation courte du prompt.
 */
function expandQuestionBank(baseQuestions, targetCount, idPrefix) {
  const source = Array.isArray(baseQuestions) ? baseQuestions : []
  if (source.length === 0) return []
  if (source.length >= targetCount) return source.slice(0, targetCount)

  const expanded = source.map((q) => ({
    ...q,
    options: (q.options || []).map((o) => ({ ...o })),
  }))

  let i = 0
  while (expanded.length < targetCount) {
    const origin = source[i % source.length]
    const variantIndex = Math.floor(i / source.length) + 1
    const variantLabel = VARIANT_LABELS[(variantIndex - 1) % VARIANT_LABELS.length]
    const rotated = rotateOptions(origin, variantIndex % Math.max(1, (origin.options || []).length))
    expanded.push({
      ...origin,
      id: `${idPrefix}${expanded.length + 1}`,
      prompt: normalizePrompt(origin.prompt, variantLabel, variantIndex),
      options: rotated.options,
      correctOptionId: rotated.correctOptionId,
    })
    i += 1
  }
  return expanded
}

const BASE_QUIZZES = [
  {
    id: 'civisme-fondamentaux',
    title: 'Fondamentaux du civisme numérique',
    description:
      'Banque de 50 questions : chaque session en tire 25 au hasard, avec minuteur (10 min). Thèmes : droits, devoirs et bonnes pratiques en ligne.',
    /** Nombre de questions tirées aléatoirement sans remise à chaque nouvelle session. */
    questionsPerSession: 25,
    /** Temps imparti pour terminer la session (minuteur). */
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'q1',
        prompt: 'La loi n° 20/017 en RDC concerne notamment :',
        options: [
          { id: 'a', label: 'Uniquement la radio et la télévision' },
          { id: 'b', label: 'Les télécommunications et les TIC' },
          { id: 'c', label: 'Seulement les réseaux sociaux privés' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q2',
        prompt: 'Dans un débat en ligne, la liberté d’expression permet de :',
        options: [
          { id: 'a', label: 'Insulter systématiquement sans conséquence' },
          { id: 'b', label: 'Ignorer toute loi nationale' },
          { id: 'c', label: 'Exprimer des opinions dans les limites légales' },
        ],
        correctOptionId: 'c',
      },
      {
        id: 'q3',
        prompt: 'Partager une information sans la vérifier peut contribuer à :',
        options: [
          { id: 'a', label: 'La désinformation et aux atteintes aux personnes' },
          { id: 'b', label: 'Renforcer automatiquement la démocratie' },
          { id: 'c', label: 'Une exemption de responsabilité en ligne' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'q4',
        prompt: 'Protéger ses mots de passe relève surtout de :',
        options: [
          { id: 'a', label: 'La seule responsabilité des plateformes' },
          { id: 'b', label: 'Une bonne hygiène numérique personnelle' },
          { id: 'c', label: 'Une obligation réservée aux entreprises' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q5',
        prompt: 'Le cyberharcèlement peut être caractérisé par :',
        options: [
          { id: 'a', label: 'Un message unique et poli' },
          { id: 'b', label: 'Des comportements répétés visant à nuire (insultes, menaces, exclusion)' },
          { id: 'c', label: 'Un désaccord ponctuel et argumenté' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q6',
        prompt: 'L’ARPTC est une autorité que les usagers peuvent consulter pour :',
        options: [
          { id: 'a', label: 'Les missions de régulation des télécommunications et des TIC (selon canaux officiels)' },
          { id: 'b', label: 'Remplacer systématiquement la justice pénale' },
          { id: 'c', label: 'Supprimer des comptes personnels sans procédure' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'q7',
        prompt: 'Les « bonnes pratiques » incluent souvent de :',
        options: [
          { id: 'a', label: 'Publier toutes les données personnelles de tiers' },
          { id: 'b', label: 'Limiter la diffusion de contenus sensibles et respecter la vie privée' },
          { id: 'c', label: 'Utiliser le même mot de passe partout pour simplifier' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q8',
        prompt: 'En cas de contenu illicite grave, une démarche adaptée peut être :',
        options: [
          { id: 'a', label: 'Ne jamais signaler aux autorités compétentes' },
          { id: 'b', label: 'Saisir les autorités compétentes selon la gravité (ex. forces de l’ordre, justice)' },
          { id: 'c', label: 'Régler uniquement par rumeur en ligne' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q9',
        prompt: 'La vie privée en ligne suppose notamment :',
        options: [
          { id: 'a', label: 'De diffuser les coordonnées d’autrui sans consentement' },
          { id: 'b', label: 'Des attentes légitimes de confidentialité pour les données personnelles' },
          { id: 'c', label: 'Qu’aucune règle ne s’applique sur Internet' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q10',
        prompt: 'Ce portail vise avant tout à :',
        options: [
          { id: 'a', label: 'Remplacer un avis juridique personnalisé dans tous les cas' },
          { id: 'b', label: 'Informer et orienter vers les autorités compétentes' },
          { id: 'c', label: 'Ignorer le cadre légal congolais' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q11',
        prompt: 'Respecter autrui en ligne suppose notamment de :',
        options: [
          { id: 'a', label: 'Publier des insultes si on est anonyme' },
          { id: 'b', label: 'Éviter harcèlement, menaces et humiliation' },
          { id: 'c', label: 'Ignorer toute modération communautaire' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q12',
        prompt: 'Diffuser la photo d’une personne sans son accord peut :',
        options: [
          { id: 'a', label: 'Être sans conséquence dans tous les cas' },
          { id: 'b', label: 'Porter atteinte à la vie privée ou au droit à l’image' },
          { id: 'c', label: 'Être autorisé uniquement le week-end' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q13',
        prompt: 'Un mot de passe plus sûr combine en général :',
        options: [
          { id: 'a', label: 'Un seul mot court du dictionnaire' },
          { id: 'b', label: 'Longueur, variété de caractères et absence de mots évidents' },
          { id: 'c', label: 'La date de naissance visible sur le profil' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q14',
        prompt: 'Le « phishing » vise souvent à :',
        options: [
          { id: 'a', label: 'Améliorer la qualité d’une photo' },
          { id: 'b', label: 'Obtenir identifiants ou données confidentielles par tromperie' },
          { id: 'c', label: 'Installer un antivirus gratuitement' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q15',
        prompt: 'Sur un réseau Wi-Fi public, il est prudent de :',
        options: [
          { id: 'a', label: 'Effectuer toutes ses opérations bancaires sans précaution' },
          { id: 'b', label: 'Éviter les opérations sensibles ou utiliser un canal sécurisé (ex. VPN)' },
          { id: 'c', label: 'Désactiver toute protection sur l’appareil' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q16',
        prompt: 'La double authentification (2FA) sert surtout à :',
        options: [
          { id: 'a', label: 'Rendre la connexion impossible' },
          { id: 'b', label: 'Renforcer la sécurité du compte en plus du mot de passe' },
          { id: 'c', label: 'Supprimer les mots de passe' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q17',
        prompt: 'Sauvegarder régulièrement ses données importantes permet de :',
        options: [
          { id: 'a', label: 'Garantir qu’elles seront publiées en ligne' },
          { id: 'b', label: 'Limiter la perte en cas de panne, vol ou ransomware' },
          { id: 'c', label: 'Éviter toute mise à jour logicielle' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q18',
        prompt: 'Pour les enfants et adolescents en ligne, une approche adaptée est de :',
        options: [
          { id: 'a', label: 'Les laisser sans cadre pour favoriser l’autonomie seule' },
          { id: 'b', label: 'Les encadrer, dialoguer et les informer des risques' },
          { id: 'c', label: 'Interdire tout accès sans exception jusqu’à 18 ans' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q19',
        prompt: 'Des propos injurieux ou menaçants répétés envers une personne peuvent :',
        options: [
          { id: 'a', label: 'Être considérés comme du simple humour sans limite' },
          { id: 'b', label: 'Relèver du harcèlement et avoir des conséquences juridiques selon les faits' },
          { id: 'c', label: 'Être protégés par l’anonymat dans tous les cas' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q20',
        prompt: 'La liberté d’expression sur Internet :',
        options: [
          { id: 'a', label: 'Autorise tout sans aucune limite' },
          { id: 'b', label: 'S’exerce dans un cadre légal (limites liées aux droits d’autrui, à l’ordre public)' },
          { id: 'c', label: 'Ne concerne que les journalistes' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q21',
        prompt: 'Un citoyen numérique responsable tend à :',
        options: [
          { id: 'a', label: 'Partager immédiatement tout message viral' },
          { id: 'b', label: 'Vérifier les informations avant de les diffuser' },
          { id: 'c', label: 'Ignorer les sources pour gagner du temps' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q22',
        prompt: 'Les conditions d’utilisation d’un service en ligne :',
        options: [
          { id: 'a', label: 'N’ont aucune valeur juridique' },
          { id: 'b', label: 'Encadrent les droits et obligations des utilisateurs et de l’éditeur' },
          { id: 'c', label: 'S’appliquent uniquement aux mineurs' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q23',
        prompt: 'Publier de fausses accusations graves contre une personne peut :',
        options: [
          { id: 'a', label: 'Être sans risque si le post est supprimé après' },
          { id: 'b', label: 'Exposer à des poursuites ou recours selon le droit applicable (ex. diffamation)' },
          { id: 'c', label: 'Être protégé par le simple fait d’être en ligne' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q24',
        prompt: 'Installer les mises à jour de sécurité sur ses appareils :',
        options: [
          { id: 'a', label: 'Est inutile si l’appareil est récent' },
          { id: 'b', label: 'Réduit souvent les failles exploitées par des logiciels malveillants' },
          { id: 'c', label: 'Supprime automatiquement toutes les données' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q25',
        prompt: 'Le traitement de données personnelles repose souvent sur :',
        options: [
          { id: 'a', label: 'L’absence totale de règles' },
          { id: 'b', label: 'Des bases légales (ex. consentement, obligations) selon les textes applicables' },
          { id: 'c', label: 'La seule volonté des réseaux sociaux sans cadre' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q26',
        prompt: 'En cas de compte compromis suspecté, une première mesure utile est de :',
        options: [
          { id: 'a', label: 'Publier son mot de passe pour demander de l’aide' },
          { id: 'b', label: 'Changer les mots de passe et activer la 2FA si possible' },
          { id: 'c', label: 'Ignorer l’incident' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q27',
        prompt: 'Les contenus de type « deepfake » peuvent :',
        options: [
          { id: 'a', label: 'Être toujours détectés à l’œil nu sans effort' },
          { id: 'b', label: 'Tromper sur l’authenticité d’images ou de voix' },
          { id: 'c', label: 'Ne concerner que la télévision analogique' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q28',
        prompt: 'Dans un débat public en ligne, une attitude constructive privilégie :',
        options: [
          { id: 'a', label: 'Les attaques ad hominem systématiques' },
          { id: 'b', label: 'L’argumentation sur le fond plutôt que l’insulte' },
          { id: 'c', label: 'La diffusion d’informations privées d’autrui' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q29',
        prompt: 'Signaler un contenu illicite ou contraire aux règles sur une plateforme :',
        options: [
          { id: 'a', label: 'Est inutile dans tous les cas' },
          { id: 'b', label: 'Peut déclencher une modération selon les politiques de la plateforme' },
          { id: 'c', label: 'Publie automatiquement le signalement sur le fil d’actualité' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q30',
        prompt: 'La « trace numérique » désigne en général :',
        options: [
          { id: 'a', label: 'Uniquement les cookies acceptés une fois' },
          { id: 'b', label: 'Les données et empreintes laissées par l’activité en ligne' },
          { id: 'c', label: 'Seulement les messages supprimés définitivement' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q31',
        prompt: 'Faire preuve d’empathie en ligne, c’est notamment :',
        options: [
          { id: 'a', label: 'Ignorer les victimes de harcèlement' },
          { id: 'b', label: 'Se rappeler qu’une personne réelle se trouve derrière l’écran' },
          { id: 'c', label: 'Multiplier les moqueries pour « détendre l’atmosphère »' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q32',
        prompt: 'Partager en continu sa localisation précise sur les réseaux :',
        options: [
          { id: 'a', label: 'Est sans risque pour la vie privée' },
          { id: 'b', label: 'Peut exposer à des risques (sécurité, confidentialité)' },
          { id: 'c', label: 'Est obligatoire pour utiliser un smartphone' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q33',
        prompt: 'Un lien raccourci ou reçu d’une source inconnue peut :',
        options: [
          { id: 'a', label: 'Toujours être considéré comme sûr' },
          { id: 'b', label: 'Masquer une destination malveillante ou trompeuse' },
          { id: 'c', label: 'Être ignoré sans risque' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q34',
        prompt: 'Les parents et éducateurs ont un rôle dans :',
        options: [
          { id: 'a', label: 'L’interdiction totale d’Internet sans dialogue' },
          { id: 'b', label: 'L’accompagnement, la médiation et l’éducation aux médias' },
          { id: 'c', label: 'Le remplacement des lois nationales' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q35',
        prompt: 'Le droit national s’applique :',
        options: [
          { id: 'a', label: 'Uniquement aux actes hors ligne' },
          { id: 'b', label: 'Aux infractions ou actes illicites commis via Internet, selon les textes' },
          { id: 'c', label: 'Jamais aux contenus publiés depuis l’étranger' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q36',
        prompt: 'Respecter la diversité en ligne implique notamment :',
        options: [
          { id: 'a', label: 'Tenir des propos discriminatoires pour « débattre »' },
          { id: 'b', label: 'Éviter le harcèlement et les discours de haine' },
          { id: 'c', label: 'Ne jamais exprimer d’opinion' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q37',
        prompt: 'Avant de publier un message, une bonne habitude est de :',
        options: [
          { id: 'a', label: 'Publier sans relire pour gagner du temps' },
          { id: 'b', label: 'Se demander s’il peut nuire, humilier ou tromper' },
          { id: 'c', label: 'Copier-coller sans vérifier la source' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q38',
        prompt: 'Les métadonnées de certaines photos peuvent :',
        options: [
          { id: 'a', label: 'Ne jamais indiquer de lieu ou de date' },
          { id: 'b', label: 'Révéler lieu ou date si elles ne sont pas retirées' },
          { id: 'c', label: 'Être lues uniquement par les tribunaux étrangers' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q39',
        prompt: 'Utiliser le même mot de passe pour tous les services :',
        options: [
          { id: 'a', label: 'Est recommandé pour la simplicité' },
          { id: 'b', label: 'Augmente l’impact si un service est compromis' },
          { id: 'c', label: 'Est sans risque si le mot de passe est court' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q40',
        prompt: 'Ce portail a pour vocation principale de :',
        options: [
          { id: 'a', label: 'Remplacer toute procédure judiciaire' },
          { id: 'b', label: 'Informer, sensibiliser et orienter vers les autorités compétentes' },
          { id: 'c', label: 'Ignorer le cadre légal en vigueur' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q41',
        prompt: 'Le cyberharcèlement peut avoir des conséquences :',
        options: [
          { id: 'a', label: 'Uniquement pour l’auteur du harcèlement positif' },
          { id: 'b', label: 'Psychologiques et sociales graves pour la victime' },
          { id: 'c', label: 'Inexistantes si le harcèlement est « en plaisantant »' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q42',
        prompt: 'Pour la confidentialité, une bonne pratique de profil est de :',
        options: [
          { id: 'a', label: 'Publier toutes ses coordonnées pour être joignable' },
          { id: 'b', label: 'Limiter les informations visibles publiquement' },
          { id: 'c', label: 'Partager son mot de passe avec des amis proches' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q43',
        prompt: 'Un message vous demandant votre mot de passe ou codes bancaires :',
        options: [
          { id: 'a', label: 'Doit toujours être suivi si le logo de la banque est affiché' },
          { id: 'b', label: 'Est très probablement une tentative d’escroquerie' },
          { id: 'c', label: 'Est légitime s’il est envoyé un dimanche' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q44',
        prompt: 'La citoyenneté numérique inclut :',
        options: [
          { id: 'a', label: 'Le non-respect des règles si la cause semble bonne' },
          { id: 'b', label: 'Le respect des droits d’autrui et des lois applicables' },
          { id: 'c', label: 'L’anonymat total garanti pour toute infraction' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q45',
        prompt: 'Les contenus haineux ou appelant à la violence :',
        options: [
          { id: 'a', label: 'Sont protégés par la liberté d’expression sans limite' },
          { id: 'b', label: 'Peuvent être sanctionnés et font l’objet de signalements' },
          { id: 'c', label: 'Ne concernent que la presse écrite' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q46',
        prompt: 'Face à une information sensationnelle non confirmée :',
        options: [
          { id: 'a', label: 'Il faut la partager vite pour ne pas être en retard' },
          { id: 'b', label: 'Il est utile de croiser plusieurs sources fiables' },
          { id: 'c', label: 'Une seule capture d’écran suffit toujours comme preuve' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q47',
        prompt: 'Les mineurs sur Internet méritent :',
        options: [
          { id: 'a', label: 'Exactement le même traitement juridique que les adultes sans nuance' },
          { id: 'b', label: 'Une protection renforcée et un accompagnement adapté à l’âge' },
          { id: 'c', label: 'D’être exclus de tout outil numérique sans exception' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q48',
        prompt: 'La réputation numérique :',
        options: [
          { id: 'a', label: 'N’influence jamais les études ou l’emploi' },
          { id: 'b', label: 'Peut influencer l’image donnée aux employeurs ou institutions' },
          { id: 'c', label: 'Se réinitialise automatiquement chaque année' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q49',
        prompt: 'Un fichier joint reçu d’une source non vérifiée :',
        options: [
          { id: 'a', label: 'Doit toujours être ouvert pour être poli' },
          { id: 'b', label: 'Ne doit pas être ouvert sans vérification (risque de malware)' },
          { id: 'c', label: 'Est sans risque s’il est en PDF' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'q50',
        prompt: 'L’objectif du civisme numérique est notamment de :',
        options: [
          { id: 'a', label: 'Multiplier les conflits en ligne' },
          { id: 'b', label: 'Favoriser un usage responsable, respectueux et éclairé du numérique' },
          { id: 'c', label: 'Éviter toute régulation ou règle' },
        ],
        correctOptionId: 'b',
      },
    ],
  },
  {
    id: 'signalement-risques',
    title: 'Signalement et risques numériques',
    description:
      'Banque de 50 questions : chaque session en tire 25 au hasard, avec minuteur (10 min). Signalements, fraude et désinformation.',
    questionsPerSession: 25,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 's1',
        prompt: 'Un signalement structuré sur ce portail sert notamment à :',
        options: [
          { id: 'a', label: 'Remplacer une plainte pénale dans tous les cas' },
          { id: 'b', label: 'Enregistrer des faits pour traitement institutionnel et orientation' },
          { id: 'c', label: 'Garantir une condamnation immédiate' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's2',
        prompt: 'La fraude numérique peut inclure :',
        options: [
          { id: 'a', label: 'Des arnaques au paiement ou à l’identité' },
          { id: 'b', label: 'Uniquement des blagues entre amis' },
          { id: 'c', label: 'Des messages publicitaires légaux clairement identifiés' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's3',
        prompt: 'La désinformation se distingue souvent d’une erreur par :',
        options: [
          { id: 'a', label: 'L’intention de tromper ou de manipuler' },
          { id: 'b', label: 'La longueur du texte uniquement' },
          { id: 'c', label: 'L’absence totale de diffusion' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's4',
        prompt: 'Joindre des pièces à un signalement permet généralement de :',
        options: [
          { id: 'a', label: 'Documenter les faits pour instruction' },
          { id: 'b', label: 'Contourner toute vérification' },
          { id: 'c', label: 'Publier automatiquement les fichiers sur le site' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's5',
        prompt: 'Usurpation d’identité en ligne peut consister à :',
        options: [
          { id: 'a', label: 'Se faire passer pour autrui pour tromper' },
          { id: 'b', label: 'Utiliser son propre nom réel' },
          { id: 'c', label: 'Lire un article sans compte' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's6',
        prompt: 'Face à une arnaque par message, une attitude prudente est de :',
        options: [
          { id: 'a', label: 'Vérifier l’expéditeur et ne pas cliquer sur des liens suspects' },
          { id: 'b', label: 'Transmettre immédiatement ses codes bancaires' },
          { id: 'c', label: 'Diffuser le message à tous ses contacts sans filtre' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's7',
        prompt: 'Le suivi d’un signalement avec référence et code secret permet :',
        options: [
          { id: 'a', label: 'De consulter l’état du dossier côté usager' },
          { id: 'b', label: 'De modifier le contenu des lois' },
          { id: 'c', label: 'D’accéder aux dossiers des autres usagers' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's8',
        prompt: 'Les sanctions pénales éventuelles relèvent :',
        options: [
          { id: 'a', label: 'Uniquement des réseaux sociaux, jamais des tribunaux' },
          { id: 'b', label: 'Des juridictions compétentes selon le droit applicable' },
          { id: 'c', label: 'D’aucune procédure en RDC' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's9',
        prompt: 'La mésinformation correspond souvent à :',
        options: [
          { id: 'a', label: 'Une information fausse partagée sans intention malveillante claire' },
          { id: 'b', label: 'Une campagne militaire uniquement' },
          { id: 'c', label: 'Une information toujours vérifiée par trois médias' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's10',
        prompt: 'Un ransomware chiffre souvent les fichiers et :',
        options: [
          { id: 'a', label: 'Améliore gratuitement la qualité vidéo' },
          { id: 'b', label: 'Exige une rançon pour un éventuel déchiffrement' },
          { id: 'c', label: 'Ne peut pas affecter les sauvegardes' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's11',
        prompt: 'Conserver une capture d’écran ou une trace peut servir à :',
        options: [
          { id: 'a', label: 'Remplacer toute procédure judiciaire' },
          { id: 'b', label: 'Documenter des faits pour un signalement ou une plainte' },
          { id: 'c', label: 'Publier systématiquement le dossier sur les réseaux' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's12',
        prompt: 'Un message urgent demandant un virement vers un nouveau compte :',
        options: [
          { id: 'a', label: 'Doit être exécuté immédiatement' },
          { id: 'b', label: 'Mérite vérification par un canal officiel indépendant du message' },
          { id: 'c', label: 'Est toujours légitime si le logo est présent' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's13',
        prompt: 'La fraude au président (BEC) vise souvent à :',
        options: [
          { id: 'a', label: 'Tromper un service pour obtenir un virement ou une action sensible' },
          { id: 'b', label: 'Récompenser les employés méritants' },
          { id: 'c', label: 'Mettre à jour gratuitement les logiciels' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's14',
        prompt: 'Une « fake news » peut se propager vite car :',
        options: [
          { id: 'a', label: 'Les réseaux favorisent parfois l’engagement émotionnel' },
          { id: 'b', label: 'Internet interdit toute diffusion' },
          { id: 'c', label: 'Les faits sont toujours vérifiés avant publication' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's15',
        prompt: 'Le vol d’identité peut servir à :',
        options: [
          { id: 'a', label: 'Ouvrir des comptes ou contracter au nom de la victime' },
          { id: 'b', label: 'Renforcer automatiquement la sécurité de la victime' },
          { id: 'c', label: 'Supprimer toute trace numérique légale' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's16',
        prompt: 'Dans un signalement, fournir des informations exactes et datées :',
        options: [
          { id: 'a', label: 'N’a aucune utilité' },
          { id: 'b', label: 'Aide à traiter et orienter le dossier' },
          { id: 'c', label: 'Remplace automatiquement une enquête policière' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's17',
        prompt: 'Un site qui copie l’apparence d’une banque pour voler des codes pratique :',
        options: [
          { id: 'a', label: 'Le phishing par imitation de site' },
          { id: 'b', label: 'La sauvegarde cloud légitime' },
          { id: 'c', label: 'La double authentification' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's18',
        prompt: 'La référence et le code secret d’un signalement servent à :',
        options: [
          { id: 'a', label: 'Publier l’affaire sur le site d’accueil' },
          { id: 'b', label: 'Identifier le dossier de façon confidentielle pour le suivi' },
          { id: 'c', label: 'Modifier le signalement d’un autre usager' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's19',
        prompt: 'Un logiciel malveillant peut se propager via :',
        options: [
          { id: 'a', label: 'Pièces jointes, clés USB ou téléchargements non fiables' },
          { id: 'b', label: 'Uniquement la télévision hertzienne' },
          { id: 'c', label: 'Les mises à jour officielles du système' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's20',
        prompt: 'La désinformation peut viser à :',
        options: [
          { id: 'a', label: 'Désunir, influencer un vote ou nuire à une réputation' },
          { id: 'b', label: 'Améliorer uniquement l’éducation civique' },
          { id: 'c', label: 'Être sans effet sur la confiance sociale' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's21',
        prompt: 'Avant de payer une facture reçue par e-mail :',
        options: [
          { id: 'a', label: 'Il faut toujours payer dans l’heure sans vérifier' },
          { id: 'b', label: 'Il est prudent de confirmer par un contact connu (téléphone officiel)' },
          { id: 'c', label: 'Le montant élevé prouve la légitimité' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's22',
        prompt: 'Un concours en ligne qui exige des frais de dossier immédiats peut être :',
        options: [
          { id: 'a', label: 'Une arnaque classique' },
          { id: 'b', label: 'Toujours une initiative de l’État' },
          { id: 'c', label: 'Garanti sans risque si la page a des photos' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's23',
        prompt: 'La rumeur et la désinformation se distinguent notamment par :',
        options: [
          { id: 'a', label: 'Le caractère souvent flou de la source pour la rumeur' },
          { id: 'b', label: 'L’absence totale de diffusion' },
          { id: 'c', label: 'Le fait qu’elles ne circulent que sur papier' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's24',
        prompt: 'Signaler un contenu pédopornographique :',
        options: [
          { id: 'a', label: 'Est sans importance' },
          { id: 'b', label: 'Peut contribuer à des enquêtes et protections selon les canaux compétents' },
          { id: 'c', label: 'Doit être fait uniquement en commentaire public' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's25',
        prompt: 'Un « spyware » sur téléphone peut :',
        options: [
          { id: 'a', label: 'Surveiller messages ou localisation à l’insu de l’utilisateur' },
          { id: 'b', label: 'Augmenter automatiquement la mémoire sans risque' },
          { id: 'c', label: 'Ne jamais être installé par une pièce jointe' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's26',
        prompt: 'L’ingénierie sociale en cybersécurité désigne :',
        options: [
          { id: 'a', label: 'Manipuler des personnes pour obtenir des informations ou accès' },
          { id: 'b', label: 'Construire des ponts physiques' },
          { id: 'c', label: 'Uniquement la formation des ingénieurs' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's27',
        prompt: 'Un signalement sérieux évite en général de :',
        options: [
          { id: 'a', label: 'Fournir des éléments vérifiables' },
          { id: 'b', label: 'Inventer ou aggraver des faits' },
          { id: 'c', label: 'Indiquer une plage horaire approximative' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's28',
        prompt: 'La carte bancaire copiée via un faux terminal ou skimming :',
        options: [
          { id: 'a', label: 'Illustre un risque de fraude au paiement' },
          { id: 'b', label: 'Est impossible dans les commerces' },
          { id: 'c', label: 'Ne concerne que le paiement en espèces' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's29',
        prompt: 'Un message « vous avez gagné » sans participation préalable est souvent :',
        options: [
          { id: 'a', label: 'Une arnaque' },
          { id: 'b', label: 'Une obligation légale de répondre' },
          { id: 'c', label: 'Un message systématiquement émis par l’ARPTC' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's30',
        prompt: 'Protéger son code secret de suivi de signalement :',
        options: [
          { id: 'a', label: 'Ne pas le partager publiquement' },
          { id: 'b', label: 'Le publier sur les réseaux pour transparence' },
          { id: 'c', label: 'L’envoyer à tout inconnu qui le demande' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's31',
        prompt: 'Un e-mail au style pressant (« agir dans l’heure ») avec faute et expéditeur étrange :',
        options: [
          { id: 'a', label: 'Doit être traité comme prioritaire absolu' },
          { id: 'b', label: 'Doit éveiller la prudence (arnaque possible)' },
          { id: 'c', label: 'Prouve toujours l’authenticité' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's32',
        prompt: 'La désinformation coordonnée (« campagne ») peut :',
        options: [
          { id: 'a', label: 'Utiliser de faux comptes ou de la répétition pour donner l’illusion de consensus' },
          { id: 'b', label: 'Être impossible sur Internet' },
          { id: 'c', label: 'Être détectée automatiquement par tous les utilisateurs' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's33',
        prompt: 'Un faux profil sur un réseau social peut servir à :',
        options: [
          { id: 'a', label: 'Hameçonner des contacts ou extorquer des informations' },
          { id: 'b', label: 'Garantir l’anonymat légal pour toute infraction' },
          { id: 'c', label: 'Remplacer une pièce d’identité officielle' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's34',
        prompt: 'Joindre une copie de conversation à un signalement :',
        options: [
          { id: 'a', label: 'Peut aider à reconstituer les faits (dans les limites légales)' },
          { id: 'b', label: 'Est interdit dans tous les cas' },
          { id: 'c', label: 'Remplace une décision de justice' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's35',
        prompt: 'Le « vishing » est une tentative de fraude :',
        options: [
          { id: 'a', label: 'Par téléphone se faisant passer pour une autorité ou un service' },
          { id: 'b', label: 'Uniquement par courrier postal' },
          { id: 'c', label: 'Impossible à réaliser' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's36',
        prompt: 'Un signalement ne garantit pas :',
        options: [
          { id: 'a', label: 'Une issue judiciaire précise sans enquête' },
          { id: 'b', label: 'L’enregistrement structuré des faits pour traitement' },
          { id: 'c', label: 'Une orientation possible selon les procédures' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's37',
        prompt: 'La fraude aux sentiments en ligne (« romance scam ») vise souvent :',
        options: [
          { id: 'a', label: 'À obtenir de l’argent sous prétexte affectif' },
          { id: 'b', label: 'À renforcer gratuitement la sécurité du compte' },
          { id: 'c', label: 'Uniquement des rencontres sans échange financier' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's38',
        prompt: 'Un lien « bit.ly » ou raccourci sans contexte dans un SMS inconnu :',
        options: [
          { id: 'a', label: 'Doit toujours être ouvert' },
          { id: 'b', label: 'Mérite prudence avant clic (smishing possible)' },
          { id: 'c', label: 'Est toujours émis par l’opérateur' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 's39',
        prompt: 'La désinformation sur la santé peut :',
        options: [
          { id: 'a', label: 'Mettre en danger des personnes qui suivent de faux conseils' },
          { id: 'b', label: 'Être sans conséquence' },
          { id: 'c', label: 'Être uniquement diffusée par des médecins' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's40',
        prompt: 'Un faux SMS de livraison ou de colis bloqué demandant un paiement :',
        options: [
          { id: 'a', label: 'Est une arnaque fréquente' },
          { id: 'b', label: 'Doit être payé avant toute vérification' },
          { id: 'c', label: 'Est toujours envoyé par La Poste sans exception' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's41',
        prompt: 'La traçabilité des paiements frauduleux :',
        options: [
          { id: 'a', label: 'Peut être étudiée par les enquêteurs compétents' },
          { id: 'b', label: 'Est impossible sur tout réseau' },
          { id: 'c', label: 'Est réservée aux réseaux sociaux uniquement' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's42',
        prompt: 'Un fichier exécutable (.exe) envoyé par un inconnu :',
        options: [
          { id: 'a', label: 'Ne doit pas être lancé sans confiance absolue dans la source' },
          { id: 'b', label: 'Est toujours un jeu sans risque' },
          { id: 'c', label: 'Ne peut pas contenir de malware' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's43',
        prompt: 'La désinformation électorale peut viser à :',
        options: [
          { id: 'a', label: 'Tromper sur les dates, bureaux ou candidats' },
          { id: 'b', label: 'Informer uniquement avec des sources officielles' },
          { id: 'c', label: 'Être impossible à partager' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's44',
        prompt: 'Un signalement peut être complété ou précisé si :',
        options: [
          { id: 'a', label: 'Les canaux du portail le prévoient et de nouveaux éléments existent' },
          { id: 'b', label: 'Il est interdit de corriger quoi que ce soit' },
          { id: 'c', label: 'Un seul mot peut être changé par an' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's45',
        prompt: 'L’arnaque au faux support technique (« votre ordinateur est infecté ») :',
        options: [
          { id: 'a', label: 'Vise souvent à prendre la main ou extorquer un paiement' },
          { id: 'b', label: 'Est toujours un service Microsoft gratuit' },
          { id: 'c', label: 'Ne concerne que les tablettes' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's46',
        prompt: 'La rumeur se distingue souvent d’un communiqué officiel par :',
        options: [
          { id: 'a', label: 'L’absence de source vérifiable claire' },
          { id: 'b', label: 'La présence systématique de signature notariée' },
          { id: 'c', label: 'La diffusion uniquement à la radio nationale' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's47',
        prompt: 'Un QR code malveillant peut :',
        options: [
          { id: 'a', label: 'Rediriger vers un site d’hameçonnage' },
          { id: 'b', label: 'Être sans risque car il est graphique' },
          { id: 'c', label: 'Ne jamais être utilisé en fraude' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's48',
        prompt: 'La conservation de preuves numériques pour autorités :',
        options: [
          { id: 'a', label: 'Doit respecter les règles de procédure et de chaîne de conservation' },
          { id: 'b', label: 'Permet de modifier les fichiers pour « clarifier »' },
          { id: 'c', label: 'Est inutile pour toute plainte' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's49',
        prompt: 'Un faux concours demandant des données bancaires « pour verser le lot » :',
        options: [
          { id: 'a', label: 'Relève typiquement de l’arnaque' },
          { id: 'b', label: 'Est une obligation légale de répondre' },
          { id: 'c', label: 'Prouve la légalité du gain' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 's50',
        prompt: 'Face à une escroquerie avérée, une démarche peut être :',
        options: [
          { id: 'a', label: 'Saisir les autorités ou services compétents avec les éléments disponibles' },
          { id: 'b', label: 'Ne jamais signaler pour ne pas « déranger »' },
          { id: 'c', label: 'Poursuivre seul le suspect sans cadre légal' },
        ],
        correctOptionId: 'a',
      },
    ],
  },
  {
    id: 'litteratie-numerique',
    title: 'Littératie numérique',
    description:
      'Banque de 50 questions : chaque session en tire 25 au hasard, avec minuteur (10 min). Littératie aux médias numériques, analyse critique et citoyenneté.',
    questionsPerSession: 25,
    timeLimitMinutes: 10,
    questions: [
      {
        id: 'ln1',
        prompt: 'La littératie aux médias numériques désigne surtout la capacité à :',
        options: [
          { id: 'a', label: 'Utiliser uniquement des logiciels sans réfléchir au contenu' },
          {
            id: 'b',
            label:
              'Accéder, comprendre, analyser et mobiliser les médias numériques de façon critique et responsable',
          },
          { id: 'c', label: 'Publier le plus possible sans tenir compte des sources' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'ln2',
        prompt: 'Par rapport à l’éducation aux médias traditionnels, la littératie aux médias numériques :',
        options: [
          { id: 'a', label: 'Les annule entièrement' },
          { id: 'b', label: 'S’inscrit dans leur continuité en intégrant les spécificités du numérique' },
          { id: 'c', label: 'Ne concerne que la télévision' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'ln3',
        prompt: 'La désinformation se distingue souvent de la mésinformation par :',
        options: [
          { id: 'a', label: 'Une information fausse diffusée sans intention de nuire' },
          { id: 'b', label: 'Une information créée ou diffusée dans l’intention de tromper ou manipuler' },
          { id: 'c', label: 'Le fait qu’elle ne circule jamais sur Internet' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'ln4',
        prompt: 'Une « chambre d’écho » numérique correspond à un environnement où l’on est surtout exposé à :',
        options: [
          { id: 'a', label: 'Des contenus et opinions proches des siens, avec peu de diversité' },
          { id: 'b', label: 'Uniquement des sources scientifiques contradictoires' },
          { id: 'c', label: 'Des contenus générés uniquement par l’État' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln5',
        prompt: 'La citoyenneté numérique implique notamment de :',
        options: [
          { id: 'a', label: 'Naviguer et s’engager en ligne de manière responsable et respectueuse' },
          { id: 'b', label: 'Ignorer les conséquences de ses actes sur sa réputation' },
          { id: 'c', label: 'Éviter toute participation aux débats publics' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln6',
        prompt: 'La vérification des faits (fact-checking) vise à :',
        options: [
          { id: 'a', label: 'Diffuser plus vite sans contrôle' },
          { id: 'b', label: 'Confirmer l’exactitude d’une information avant de la relayer ou l’utiliser' },
          { id: 'c', label: 'Supprimer toute opinion personnelle' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'ln7',
        prompt: 'La littératie aux médias numériques se réduit-elle à la maîtrise technique des outils ?',
        options: [
          { id: 'a', label: 'Oui, seuls les logiciels comptent' },
          { id: 'b', label: 'Non, elle inclut aussi l’analyse critique et la compréhension des enjeux' },
          { id: 'c', label: 'Oui, pour les adultes uniquement' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'ln8',
        prompt: 'L’absence de compétences en littératie numérique peut, face aux services en ligne, :',
        options: [
          { id: 'a', label: 'Être un facteur d’exclusion pour accéder à l’éducation ou à l’emploi' },
          { id: 'b', label: 'Être sans effet sur la participation sociale' },
          { id: 'c', label: 'Être réservée aux zones rurales uniquement' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln9',
        prompt: 'Dans l’enseignement, la littératie aux médias numériques est souvent décrite comme :',
        options: [
          { id: 'a', label: 'Une matière isolée sans lien avec les autres disciplines' },
          { id: 'b', label: 'Une compétence transversale pouvant s’intégrer à plusieurs matières' },
          { id: 'c', label: 'Réservée au cours de sport' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'ln10',
        prompt: 'Les métadonnées d’un contenu numérique sont des informations qui peuvent inclure :',
        options: [
          { id: 'a', label: 'Uniquement le nombre de « j’aime » sans autre détail' },
          { id: 'b', label: 'Par exemple la date, l’auteur ou le type d’appareil, utiles pour analyser le contenu' },
          { id: 'c', label: 'Le contenu principal du message uniquement' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'ln11',
        prompt: 'L’effet d’écho sur les réseaux peut :',
        options: [
          { id: 'a', label: 'Répéter une idée fausse en donnant l’illusion qu’elle est largement validée' },
          { id: 'b', label: 'Garantir la diversité des points de vue' },
          { id: 'c', label: 'Supprimer tous les algorithmes' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln12',
        prompt: 'Distinguer les faits des opinions, c’est :',
        options: [
          { id: 'a', label: 'Confondre interprétation et donnée vérifiable' },
          { id: 'b', label: 'Identifier ce qui est vérifiable de ce qui est subjectif' },
          { id: 'c', label: 'Ignorer toute source' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'ln13',
        prompt: 'La propriété intellectuelle en ligne protège notamment :',
        options: [
          { id: 'a', label: 'Les créations (textes, images, sons) selon les règles applicables' },
          { id: 'b', label: 'Uniquement les biens physiques' },
          { id: 'c', label: 'Aucun contenu numérique' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln14',
        prompt: 'La diversité des sources permet de :',
        options: [
          { id: 'a', label: 'Réduire les biais liés à une seule origine' },
          { id: 'b', label: 'Éviter toute vérification' },
          { id: 'c', label: 'Lire uniquement un fil d’actualité personnalisé' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln15',
        prompt: 'L’accessibilité numérique vise à :',
        options: [
          { id: 'a', label: 'Rendre les contenus utilisables par plus de personnes, y compris en situation de handicap' },
          { id: 'b', label: 'Rendre Internet plus lent' },
          { id: 'c', label: 'Supprimer les images sur tous les sites' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln16',
        prompt: 'La transparence algorithmique, dans l’idéal, permettrait de :',
        options: [
          { id: 'a', label: 'Mieux comprendre pourquoi certains contenus sont mis en avant' },
          { id: 'b', label: 'Supprimer tout algorithme' },
          { id: 'c', label: 'Garantir que tous les contenus sont vrais' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln17',
        prompt: 'Les traces numériques regroupent :',
        options: [
          { id: 'a', label: 'Données issues de navigation, interactions ou transactions' },
          { id: 'b', label: 'Uniquement les mots de passe oubliés' },
          { id: 'c', label: 'Seulement les publications papier' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln18',
        prompt: 'Analyser un média, c’est notamment :',
        options: [
          { id: 'a', label: 'Questionner l’auteur, la visée et le contexte' },
          { id: 'b', label: 'Accepter le message sans réflexion' },
          { id: 'c', label: 'Ignorer le producteur du contenu' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln19',
        prompt: 'La littératie aux médias numériques dans l’école peut s’intégrer :',
        options: [
          { id: 'a', label: 'En histoire, langues, sciences et autres matières' },
          { id: 'b', label: 'Uniquement en cours de sport' },
          { id: 'c', label: 'Sans lien avec les programmes' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln20',
        prompt: 'Produire un contenu numérique responsable implique :',
        options: [
          { id: 'a', label: 'Respecter le droit, la dignité d’autrui et citer quand c’est requis' },
          { id: 'b', label: 'Copier sans mention les œuvres d’autrui' },
          { id: 'c', label: 'Diffuser des rumeurs pour le débat' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln21',
        prompt: 'Un usage fréquent des réseaux garantit-il une maîtrise critique ?',
        options: [
          { id: 'a', label: 'Oui, automatiquement' },
          { id: 'b', label: 'Non, l’usage n’équivaut pas à l’analyse ou à la vérification' },
          { id: 'c', label: 'Oui, pour les moins de 12 ans uniquement' },
        ],
        correctOptionId: 'b',
      },
      {
        id: 'ln22',
        prompt: 'Identifier la source d’une information, c’est :',
        options: [
          { id: 'a', label: 'Une étape utile avant de la croire ou la partager' },
          { id: 'b', label: 'Inutile si le titre est accrocheur' },
          { id: 'c', label: 'Réservé aux journalistes professionnels seulement' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln23',
        prompt: 'Les stéréotypes dans les médias peuvent :',
        options: [
          { id: 'a', label: 'Renforcer des préjugés si on ne les analyse pas' },
          { id: 'b', label: 'Être sans effet sur les représentations' },
          { id: 'c', label: 'N’exister que dans la presse papier' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln24',
        prompt: 'La pensée critique face à l’information inclut :',
        options: [
          { id: 'a', label: 'Questionner, comparer et évaluer la fiabilité' },
          { id: 'b', label: 'Accepter la première chaîne vue' },
          { id: 'c', label: 'Refuser toute donnée chiffrée' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln25',
        prompt: 'La réputation en ligne renvoie à :',
        options: [
          { id: 'a', label: 'La perception qu’ont les autres à partir d’informations publiques' },
          { id: 'b', label: 'Uniquement la note d’un examen' },
          { id: 'c', label: 'La vitesse de la connexion Internet' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln26',
        prompt: 'Une licence sur un contenu (ex. Creative Commons) précise :',
        options: [
          { id: 'a', label: 'Les conditions autorisées de réutilisation' },
          { id: 'b', label: 'La couleur du site' },
          { id: 'c', label: 'Rien d’obligatoire' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln27',
        prompt: 'L’inclusion numérique cherche à :',
        options: [
          { id: 'a', label: 'Réduire les écarts d’accès et de compétences' },
          { id: 'b', label: 'Limiter Internet aux villes' },
          { id: 'c', label: 'Supprimer les formations' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln28',
        prompt: 'Comparer plusieurs sources indépendantes sur un même fait permet de :',
        options: [
          { id: 'a', label: 'Détecter des incohérences ou des biais' },
          { id: 'b', label: 'Perdre du temps sans bénéfice' },
          { id: 'c', label: 'Copier le texte le plus long' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln29',
        prompt: '« Accéder et naviguer » en littératie numérique inclut :',
        options: [
          { id: 'a', label: 'Savoir utiliser des outils et rechercher l’information' },
          { id: 'b', label: 'Éviter tout moteur de recherche' },
          { id: 'c', label: 'Ne lire que le premier résultat' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln30',
        prompt: 'Les algorithmes de recommandation peuvent :',
        options: [
          { id: 'a', label: 'Renforcer l’exposition à certains types de contenus' },
          { id: 'b', label: 'Être neutres au sens absolu dans tous les cas' },
          { id: 'c', label: 'Ne pas influencer ce que l’on voit' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln31',
        prompt: 'La littératie aux médias numériques en contexte de RDC est particulièrement liée à :',
        options: [
          { id: 'a', label: 'L’expansion des usages mobiles et de l’accès Internet' },
          { id: 'b', label: 'L’absence totale de médias' },
          { id: 'c', label: 'La fin de toute éducation aux médias' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln32',
        prompt: 'Participer de manière responsable à la vie numérique, c’est notamment :',
        options: [
          { id: 'a', label: 'Respecter les règles et les personnes dans les espaces en ligne' },
          { id: 'b', label: 'Multiplier les contenus haineux pour être visible' },
          { id: 'c', label: 'Ignorer les conséquences collectives' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln33',
        prompt: 'Un contenu trompeur peut utiliser :',
        options: [
          { id: 'a', label: 'Un titre sensationnel hors contexte ou une image manipulée' },
          { id: 'b', label: 'Uniquement des textes sans image' },
          { id: 'c', label: 'Des sources toujours affichées en grand' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln34',
        prompt: 'L’éducation aux médias traditionnels et la littératie numérique sont :',
        options: [
          { id: 'a', label: 'Complémentaires pour analyser les messages' },
          { id: 'b', label: 'Mutuellement exclusives' },
          { id: 'c', label: 'Réservées aux médias imprimés uniquement' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln35',
        prompt: 'Développer une citoyenneté numérique active suppose :',
        options: [
          { id: 'a', label: 'De comprendre ses droits et responsabilités en ligne' },
          { id: 'b', label: 'De ne jamais intervenir dans un débat' },
          { id: 'c', label: 'D’ignorer les signalements' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln36',
        prompt: 'La vérification des faits peut inclure :',
        options: [
          { id: 'a', label: 'Recouper des sources, dates et contextes' },
          { id: 'b', label: 'Partager la première capture d’écran' },
          { id: 'c', label: 'Croire un message si le ton est urgent' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln37',
        prompt: 'Les enjeux numériques (données, algorithmes, modèles économiques) sont :',
        options: [
          { id: 'a', label: 'Souvent liés entre eux et à analyser globalement' },
          { id: 'b', label: 'Totalement indépendants les uns des autres' },
          { id: 'c', label: 'Sans importance pour les citoyens' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln38',
        prompt: 'Une compétence transversale signifie qu’elle :',
        options: [
          { id: 'a', label: 'Peut se travailler dans plusieurs disciplines ou situations' },
          { id: 'b', label: 'Ne concerne qu’une seule matière' },
          { id: 'c', label: 'Remplace toutes les matières' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln39',
        prompt: 'L’identité numérique regroupe :',
        options: [
          { id: 'a', label: 'Les informations qui identifient une personne sur Internet' },
          { id: 'b', label: 'Uniquement le numéro de téléphone fixe' },
          { id: 'c', label: 'Seulement une photo papier' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln40',
        prompt: 'Pour analyser une vidéo virale, il est utile de :',
        options: [
          { id: 'a', label: 'Vérifier l’origine, la date et le contexte avant de conclure' },
          { id: 'b', label: 'La partager immédiatement pour avis' },
          { id: 'c', label: 'Ignorer tout commentaire contradictoire' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln41',
        prompt: 'La littératie numérique contribue à l’équité lorsqu’elle :',
        options: [
          { id: 'a', label: 'Réduit les écarts d’accès aux compétences et à l’information' },
          { id: 'b', label: 'Réserve l’information aux seuls experts' },
          { id: 'c', label: 'Ignore les contextes locaux' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln42',
        prompt: 'Un média peut avoir un « point de vue » : cela invite à :',
        options: [
          { id: 'a', label: 'Identifier le cadre éditorial et les intentions possibles' },
          { id: 'b', label: 'Supprimer toute analyse' },
          { id: 'c', label: 'Croire tout message sans distinction' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln43',
        prompt: 'La désinformation peut être amplifiée par :',
        options: [
          { id: 'a', label: 'Les réseaux sociaux et la rapidité de partage' },
          { id: 'b', label: 'La seule lecture de livres imprimés' },
          { id: 'c', label: 'L’absence totale de lecteurs' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln44',
        prompt: '« Produire et communiquer » en littératie inclut :',
        options: [
          { id: 'a', label: 'Créer des contenus avec respect des règles et éthique' },
          { id: 'b', label: 'Publier sans jamais vérifier' },
          { id: 'c', label: 'Interdire toute image' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln45',
        prompt: 'Un esprit critique face aux contenus numériques aide à :',
        options: [
          { id: 'a', label: 'Résister à la manipulation et à la désinformation' },
          { id: 'b', label: 'Rejeter toute information sans distinction' },
          { id: 'c', label: 'Éviter toute source institutionnelle' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln46',
        prompt: 'La littératie aux médias numériques est une pratique :',
        options: [
          { id: 'a', label: 'Évolutive, à renouveler avec les technologies et les usages' },
          { id: 'b', label: 'Fixe une fois pour toutes à 15 ans' },
          { id: 'c', label: 'Inutile après la formation initiale' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln47',
        prompt: 'Interagir dans des espaces numériques demande :',
        options: [
          { id: 'a', label: 'De respecter les règles de la communauté et les personnes' },
          { id: 'b', label: 'D’être agressif pour se faire entendre' },
          { id: 'c', label: 'De publier des données d’autrui sans consentement' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln48',
        prompt: 'Comprendre le fonctionnement des plateformes (modération, recommandations) permet :',
        options: [
          { id: 'a', label: 'D’interpréter ce que l’on voit et pourquoi' },
          { id: 'b', label: 'De croire que tout est neutre sans exception' },
          { id: 'c', label: 'D’ignorer les conditions d’utilisation' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln49',
        prompt: 'Former des citoyens critiques et engagés via la littératie numérique vise notamment à :',
        options: [
          { id: 'a', label: 'Comprendre les mécanismes de diffusion de l’information et agir de façon éclairée' },
          { id: 'b', label: 'Éviter toute participation publique' },
          { id: 'c', label: 'Accepter toute information sans vérification' },
        ],
        correctOptionId: 'a',
      },
      {
        id: 'ln50',
        prompt: 'En synthèse, la littératie aux médias numériques dépasse :',
        options: [
          { id: 'a', label: 'La simple maîtrise technique pour inclure analyse, éthique et enjeux sociaux' },
          { id: 'b', label: 'Tout apprentissage scolaire' },
          { id: 'c', label: 'Uniquement la lecture de livres' },
        ],
        correctOptionId: 'a',
      },
    ],
  },
]

export const QUIZZES = BASE_QUIZZES.map((quiz) => {
  let idPrefix = 'q'
  if (quiz.id === 'signalement-risques') idPrefix = 's'
  if (quiz.id === 'litteratie-numerique') idPrefix = 'ln'

  return {
    ...quiz,
    description:
      'Banque de 200 questions : chaque session en tire 25 au hasard, avec minuteur (10 min).',
    questions: expandQuestionBank(quiz.questions, 200, idPrefix),
  }
})

export function getQuizById(id) {
  return QUIZZES.find((q) => q.id === id) || null
}
