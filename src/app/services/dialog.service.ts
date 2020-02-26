import { Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { DialogComponent } from '../components/dialog/dialog.component';

export interface DialogData {
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) {}

  openDialog(data: DialogData, callbackfn: (boolean) => void = (b) => {}): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      callbackfn(result);
    });
  }
}
