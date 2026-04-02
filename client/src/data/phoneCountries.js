import { getCountries, getCountryCallingCode } from 'libphonenumber-js'

const regionNames = new Intl.DisplayNames(['fr'], { type: 'region' })

/** Liste triée : tous les pays supportés par libphonenumber avec indicatif. */
export const PHONE_COUNTRIES = getCountries()
  .map((iso) => {
    const dial = getCountryCallingCode(iso)
    let name
    try {
      name = regionNames.of(iso)
    } catch {
      name = iso
    }
    return {
      iso,
      dial,
      label: `${name} (+${dial})`,
    }
  })
  .sort((a, b) => a.label.localeCompare(b.label, 'fr'))
