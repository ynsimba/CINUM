const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/;

function isStrongPassword(value) {
  return STRONG_PASSWORD_REGEX.test(String(value || ''));
}

const PASSWORD_POLICY_MESSAGE =
  'Le mot de passe doit contenir au moins 10 caractères, avec majuscule, minuscule, chiffre et caractère spécial.';

module.exports = {
  STRONG_PASSWORD_REGEX,
  isStrongPassword,
  PASSWORD_POLICY_MESSAGE,
};
