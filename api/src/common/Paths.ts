/**
 * Express router paths go here.
 */


export default {
  Base: '/api',
  Tattoos: {
    Base: '/tattoos',
    Get: '/',
    GetUn: '/:id',
    RechercheSujet: '/sujet/:sujet',
    RechercheCourriel: '/courriel/:courriel',
    Add: '/',
    Update: '/',
    Delete: '/delete/:id'
  },
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
} as const;
