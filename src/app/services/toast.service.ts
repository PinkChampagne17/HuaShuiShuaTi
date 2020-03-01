import { Injectable, TemplateRef } from '@angular/core';

export enum ToastBackgroundColor {
  danger = 'bg-danger text-light',
  success = 'bg-success text-light',
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(text: string, backgroundColor: ToastBackgroundColor, delay: number = 3000) {
    this.originalShow(text, {
      classname: backgroundColor,
      delay: delay
    });
  }

  originalShow(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}