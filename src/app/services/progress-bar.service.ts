import { Injectable } from '@angular/core';

export enum ProgressBarMode{
  determinate = "determinate",
  indeterminate = "indeterminate"
}

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
 
  public mode: ProgressBarMode = ProgressBarMode.determinate;
  public value: string = "0";

  public setMode(mode: ProgressBarMode, value: number = 0): void {
    this.mode = mode;
    this.setValue(value);
  }

  public setValue(value: number) {
    this.value = value.toString();
  }
  
}
