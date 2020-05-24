import { Injectable } from '@angular/core';

export interface DialogData {
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  openDialog(data: DialogData, callbackfn: (boolean) => void = (b) => {}): void {
    var result = window.confirm(data.content);
    callbackfn(result);
  }
}
