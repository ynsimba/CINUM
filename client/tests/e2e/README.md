# Tests E2E (Playwright)

## Pré-requis

- API et client démarrés (`npm run dev` à la racine) ;
- base de test prête.

## Variables optionnelles

- `E2E_BASE_URL` (défaut: `http://127.0.0.1:5173`)
- `E2E_ADMIN_EMAIL`
- `E2E_ADMIN_PASSWORD`

## Exécution

```bash
npm run test:e2e --prefix client
```

> Le test de connexion admin est automatiquement ignoré si les identifiants E2E ne sont pas fournis.
