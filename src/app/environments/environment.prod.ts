// src/environments/environment.prod.ts
export const environment = {
    production: true,
  
    // URLs reales en producción
    apiBaseUrl: 'https://localhost:44343',
    wsUrl: 'wss://localhost:44343',
  
    featureFlags: {
      mockAuth: false
    }
  };
  