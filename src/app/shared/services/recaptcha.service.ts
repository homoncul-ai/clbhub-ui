import { inject, Injectable } from '@angular/core';
import { AppConstants } from '@app/shell/services/config.service';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private readonly appConstants = inject(AppConstants);
  private scriptPromise: Promise<void> | null = null;
  private loadedSiteKey: string | null = null;

  preload(): Promise<void> {
    return this.ensureLoaded();
  }

  async execute(action: string): Promise<string> {
    await this.ensureLoaded();
    const siteKey = this.appConstants.captchaSiteKey();
    if (!siteKey) {
      throw new Error('reCAPTCHA site key is not configured.');
    }
    if (!window.grecaptcha?.execute) {
      throw new Error('reCAPTCHA is not available.');
    }
    return new Promise((resolve, reject) => {
      window.grecaptcha!.ready(() => {
        window.grecaptcha!.execute!(siteKey, { action })
          .then((token) => resolve(token || ''))
          .catch(reject);
      });
    });
  }

  private ensureLoaded(): Promise<void> {
    const siteKey = this.appConstants.captchaSiteKey();
    if (!siteKey) {
      return Promise.reject(new Error('reCAPTCHA site key is not configured.'));
    }
    if (window.grecaptcha?.execute && this.loadedSiteKey === siteKey) {
      return Promise.resolve();
    }
    if (this.scriptPromise && this.loadedSiteKey === siteKey) {
      return this.scriptPromise;
    }
    this.scriptPromise = this.loadScript(siteKey);
    return this.scriptPromise;
  }

  private loadScript(siteKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-recaptcha-v3="true"]') as HTMLScriptElement | null;
      if (existing && this.loadedSiteKey !== siteKey) {
        existing.remove();
        window.grecaptcha = undefined;
      }
      if (window.grecaptcha?.execute && this.loadedSiteKey === siteKey) {
        resolve();
        return;
      }
      if (existing) {
        existing.addEventListener('load', () => {
          this.loadedSiteKey = siteKey;
          resolve();
        }, { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.setAttribute('data-recaptcha-v3', 'true');
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.loadedSiteKey = siteKey;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA.'));
      document.head.appendChild(script);
    });
  }
}
