/** FAQ structurée par thème (contenu éditorial — à adapter par l’institution). */

export const FAQ_THEMES = [
  {
    id: 'droits',
    title: 'Droits numériques',
    items: [
      {
        q: 'Le portail remplace-t-il un avis juridique personnalisé ?',
        a: 'Non. Les contenus sont pédagogiques et généraux. Pour une situation personnelle, rapprochez-vous d’un professionnel du droit ou des autorités compétentes.',
      },
      {
        q: 'Quels droits sont souvent évoqués en ligne ?',
        a: 'Parmi d’autres : respect de la vie privée, liberté d’expression dans les limites légales, protection contre certaines atteintes (harcèlement, atteinte à l’image). Le cadre exact dépend du droit applicable et des faits.',
      },
      {
        q: 'Pourquoi le civisme numérique est-il présenté comme un enjeu stratégique ?',
        a: 'Parce qu’il contribue à la sécurité nationale, à la cohésion sociale et à la résilience des citoyens face à la désinformation, à la fraude et aux autres menaces numériques.',
      },
      {
        q: 'Mes données sur ce site sont-elles protégées ?',
        a: 'Le portail applique des mesures de sécurité (HTTPS en production, contrôle d’accès, etc.). Les traitements sont décrits dans la politique de confidentialité.',
      },
    ],
  },
  {
    id: 'signalement',
    title: 'Signalement',
    items: [
      {
        q: 'Un signalement sur ce site vaut-il plainte pénale ?',
        a: 'Pas automatiquement. Le formulaire permet d’orienter le traitement institutionnel. Les infractions graves peuvent nécessiter une saisine des forces de l’ordre ou du parquet selon les règles en vigueur.',
      },
      {
        q: 'Comment suivre mon dossier ?',
        a: 'Après envoi, conservez la référence et le code secret : vous pouvez consulter l’état du dossier sur la page « Suivi d’un signalement ».',
      },
      {
        q: 'Puis-je joindre des fichiers ?',
        a: 'Oui. Vous pouvez joindre des preuves (documents, photos, vidéos, audios) et ajouter des liens (URL) lorsque vous en disposez, dans la limite affichée sur le formulaire.',
      },
      {
        q: 'Puis-je faire un signalement anonyme ?',
        a: 'Oui. Si vous n’êtes pas directement victime ou concerné(e), vous pouvez choisir l’option de signalement anonyme et transmettre uniquement les éléments utiles au traitement.',
      },
      {
        q: 'Combien de temps prend le traitement d’un signalement ?',
        a: 'Les délais varient selon la complexité des faits et les vérifications nécessaires. Le portail affiche un statut de progression et peut, selon le dossier, proposer un rendez-vous de suivi.',
      },
      {
        q: 'Que faire si j’ai perdu ma référence ou mon code secret ?',
        a: 'Contactez le service via la page Contact en fournissant des éléments d’authentification du dossier. Pour des raisons de sécurité, le code secret n’est pas réaffiché publiquement.',
      },
      {
        q: 'Puis-je modifier un signalement déjà envoyé ?',
        a: 'Le formulaire ne permet pas l’édition directe après soumission. En cas d’information complémentaire, utilisez les canaux de contact en rappelant la référence du dossier.',
      },
    ],
  },
  {
    id: 'securite',
    title: 'Sécurité numérique',
    items: [
      {
        q: 'Comment reconnaître un message de phishing ?',
        a: 'Méfiez-vous des messages urgents, liens suspects, fautes inhabituelles et demandes de mot de passe/code OTP. Vérifiez toujours l’expéditeur et l’URL avant de cliquer.',
      },
      {
        q: 'Quelles sont les 3 mesures minimales de protection pour un citoyen ?',
        a: 'Utiliser des mots de passe forts et uniques, activer l’authentification multifactorielle, et maintenir téléphone/ordinateur/applications à jour.',
      },
      {
        q: 'Que faire en cas de compte piraté ?',
        a: 'Changez immédiatement le mot de passe, déconnectez toutes les sessions, activez la MFA, vérifiez l’e-mail de récupération, puis signalez l’incident à la plateforme concernée.',
      },
      {
        q: 'Pourquoi vérifier une information avant partage ?',
        a: 'Un partage non vérifié peut propager la désinformation, nuire à des personnes et fragiliser la cohésion sociale. Vérifiez la source, la date et le contexte.',
      },
    ],
  },
  {
    id: 'arptc',
    title: 'ARPTC',
    items: [
      {
        q: "Qu'est-ce que l'ARPTC ?",
        a: "L'Autorité de Régulation de la Poste et des Télécommunications du Congo exerce des missions de régulation dans le secteur des télécommunications et des TIC, selon le cadre légal et les missions publiées par l'institution.",
      },
      {
        q: 'Ce portail parle-t-il au nom de l’ARPTC ?',
        a: 'Non, sauf mention expresse. Le site CINUM informe et oriente. Pour les procédures officielles auprès de l’ARPTC, utilisez les canaux publiés par cette autorité.',
      },
      {
        q: 'Où trouver les coordonnées à jour de l’ARPTC ?',
        a: 'Consultez le site institutionnel de l’ARPTC et les publications officielles (guichets, lignes d’information, etc.). Les liens sur ce portail sont donnés à titre d’orientation.',
      },
    ],
  },
]
