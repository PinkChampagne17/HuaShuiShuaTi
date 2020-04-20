import { Injectable } from '@angular/core';

export enum ToastBackgroundColor {
  danger = 'bg-danger text-light',
  success = 'bg-success text-light',
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(text: string, backgroundColor: ToastBackgroundColor, delay: number = 3000) {
    alert(text);
  }
}