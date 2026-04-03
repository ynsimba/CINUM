/** Aligné sur prisma/schema.prisma — enums AbuseType et ReportStatus */
const ABUSE_TYPES = ['cyberharcelement', 'desinformation', 'fraude', 'usurpation', 'autre'];

const STATUSES = ['pending', 'reviewed', 'forwarded_arptc', 'closed'];

/** Pièce d’identité acceptée (formulaire signalement) */
const IDENTITY_DOC_TYPES = ['carte_electeur', 'passeport', 'permis_conduire'];

module.exports = { ABUSE_TYPES, STATUSES, IDENTITY_DOC_TYPES };
