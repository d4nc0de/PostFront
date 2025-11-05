// src/environments/environment.ts
export const environment = {
    production: false,
  
    // URLs de tu backend local
    apiBaseUrl: 'https://localhost:44343',
    wsUrl: 'ws://localhost:44343', 
  
    // lo que necesites
    featureFlags: {
      mockAuth: true
    }
  };
  