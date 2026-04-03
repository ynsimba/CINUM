const nodemailer = require('nodemailer');

function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

const fromAddr = () => process.env.SMTP_FROM || 'noreply@cinum.local';

/**
 * Accusé de réception à l’usager + alerte admin (nouveau dossier).
 * Les erreurs sont journalisées sans faire échouer la création du signalement.
 */
async function sendReportEmails({
  userEmail,
  reference,
  accessSecret,
  abuseType,
  siteUrl,
}) {
  const transport = getTransport();
  if (!transport) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[mail] SMTP non configuré (SMTP_HOST) — e-mails non envoyés.');
    }
    return;
  }

  const base = (siteUrl || process.env.PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const suiviUrl = base ? `${base}/signalement/suivi` : '/signalement/suivi';

  const textUser = [
    'Bonjour,',
    '',
    `Votre signalement a bien été enregistré sous la référence : ${reference}.`,
    '',
    `Code secret de suivi (à conserver) : ${accessSecret}`,
    '',
    `Consultez l'état du dossier : ${suiviUrl}`,
    '',
    'Ce message est automatique. Pour toute question, utilisez les coordonnées du portail.',
    '',
    '— Portail civisme numérique (CINUM)',
  ].join('\n');

  try {
    await transport.sendMail({
      from: fromAddr(),
      to: userEmail,
      subject: `[CINUM] Accusé de réception — ${reference}`,
      text: textUser,
    });
  } catch (e) {
    console.error('[mail] Échec envoi accusé réception :', e.message);
  }

  const adminTo = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminTo) {
    const textAdmin = [
      'Nouveau signalement enregistré.',
      '',
      `Référence : ${reference}`,
      `Type : ${abuseType}`,
      `Courriel du déclarant : ${userEmail}`,
      '',
      base ? `Administration : ${base}/admin/signalements` : 'Connectez-vous à l’administration pour le traiter.',
    ].join('\n');

    try {
      await transport.sendMail({
        from: fromAddr(),
        to: adminTo.split(',').map((s) => s.trim()).filter(Boolean),
        subject: `[CINUM Admin] Nouveau signalement ${reference}`,
        text: textAdmin,
      });
    } catch (e) {
      console.error('[mail] Échec notification admin :', e.message);
    }
  }
}

/**
 * Informe le plaignant qu’un rendez-vous a été fixé ou modifié (depuis l’admin).
 */
async function sendReportAppointmentEmail({ userEmail, reference, appointmentAt, appointmentNote, siteUrl }) {
  if (!userEmail || !appointmentAt) return;
  const transport = getTransport();
  if (!transport) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[mail] SMTP non configuré — notification de rendez-vous non envoyée.');
    }
    return;
  }

  const base = (siteUrl || process.env.PUBLIC_SITE_URL || '').replace(/\/$/, '');
  const suiviUrl = base ? `${base}/signalement/suivi` : '/signalement/suivi';
  const when = new Date(appointmentAt);
  const dateStr = Number.isNaN(when.getTime())
    ? String(appointmentAt)
    : when.toLocaleString('fr-CD', { dateStyle: 'full', timeStyle: 'short' });
  const noteBlock =
    appointmentNote && String(appointmentNote).trim()
      ? ['', 'Précisions :', String(appointmentNote).trim(), '']
      : [''];

  const text = [
    'Bonjour,',
    '',
    `Concernant votre dossier ${reference}, un rendez-vous a été enregistré :`,
    '',
    dateStr,
    ...noteBlock,
    `Pour suivre votre dossier : ${suiviUrl}`,
    '',
    '— Portail civisme numérique (CINUM)',
  ].join('\n');

  try {
    await transport.sendMail({
      from: fromAddr(),
      to: userEmail,
      subject: `[CINUM] Rendez-vous — ${reference}`,
      text,
    });
  } catch (e) {
    console.error('[mail] Échec notification rendez-vous :', e.message);
  }
}

module.exports = { sendReportEmails, sendReportAppointmentEmail, getTransport };
