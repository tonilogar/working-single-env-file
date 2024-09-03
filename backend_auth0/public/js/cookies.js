/*  Castellano */
const orejimeConfig = {
  privacyPolicy: '/privacy', // Ruta a tu política de privacidad
  apps: [{
      name: 'Google Analytics',
      title: 'Google Analytics',
      description: 'Recopila estadísticas de visitantes',
      cookies: ['_ga', '_gid', '_gat'],
      required: false,
  }],
  translations: {
      es: {
          consentModal: {
              title: 'Uso de cookies',
              description: 'Utilizamos cookies para mejorar la experiencia del usuario. Puede aceptar o rechazar el uso de cookies no esenciales.',
          },
          consentNotice: {
              description: 'Utilizamos cookies para mejorar su experiencia.',
              learnMore: 'Configurar',
              acceptAll: 'Aceptar todo',
              decline: 'Rechazar todo'
          },
          app: {
              disableAll: 'Desactivar todo',
              enableAll: 'Activar todo',
          },
          purpose: {
              consentDescription: 'Permitir el almacenamiento de cookies para {purpose}.',
              purposes: {
                  analytics: 'análisis',
                  advertising: 'publicidad',
                  functionality: 'funcionalidad',
              },
          },
          accept: 'Aceptar',
          decline: 'Rechazar'
      },
  },
};

Orejime.init(orejimeConfig);