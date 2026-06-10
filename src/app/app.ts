import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LgpdConsentModalComponent } from './features/lgpd/lgpd-consent-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LgpdConsentModalComponent],
  templateUrl: './app.html'
})
export class App {}
