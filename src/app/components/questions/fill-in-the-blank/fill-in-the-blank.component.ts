import { Component, Input } from '@angular/core';
import { AnswerDetail } from '../questions.component';

@Component({
  selector: 'app-fill-in-the-blank',
  templateUrl: './fill-in-the-blank.component.html',
  styleUrls: ['./fill-in-the-blank.component.scss']
})
export class FillInTheBlankComponent {
  
  @Input()
  public detail: AnswerDetail;
  @Input()
  public answer: string;

  public _input: string = "";

  public get input(): string {
    return this._input;
  }

  public set input(value: string) {
    this._input = value;
    if(this.input == this.answer) {
      this.detail.isRight = this.detail.isAnswered = true;
    }
  }

  ngDoCheck(): void {
    if(this.detail.isSkipped) {
      this.input = this.answer;
    }
  }

}
