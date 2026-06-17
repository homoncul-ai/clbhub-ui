import { Component } from '@angular/core';

@Component({
  selector: 'app-recaptcha-disclosure',
  standalone: true,
  template: `
    <small class="recaptcha-disclosure text-muted d-block">
      This site is protected by reCAPTCHA and the Google
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy Policy</a>
      and
      <a href="https://policies.google.com/terms" target="_blank" rel="noopener">Terms of Service</a>
      apply.
    </small>
  `,
  styles: [`
    .recaptcha-disclosure a {
      color: inherit;
      text-decoration: underline;
    }
  `],
})
export class RecaptchaDisclosureComponent {}
