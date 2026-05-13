import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { APP_INITIALIZER, isDevMode } from '@angular/core';

// Import both injection functions
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        return () => {
          // Initialize both Vercel services
          injectAnalytics({ mode: isDevMode() ? 'development' : 'production' });
          injectSpeedInsights({ debug: isDevMode() });
        };
      },
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
