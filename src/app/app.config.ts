import {
  ApplicationConfig
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideAnimations
} from '@angular/platform-browser/animations';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';

import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {

  providers: [

    provideRouter(routes),

   provideAnimations(),

   providePrimeNG({
      theme: {
        preset: Aura
      }
    }),

  ]

};