import { Component, Input } from '@angular/core';
import { Question } from 'src/app/lib/question-service';

@Component({
  selector: 'app-edit-multiple-answer',
  templateUrl: './edit-multiple-answer.component.html',
  styleUrls: ['./edit-multiple-answer.component.scss']
})
export class EditMultipleAnswerComponent {

  @Input()
  public questionViewModel: Question;
  
  private _number: number;

  public get number(): number {
    return this._number;
  }

  public set number(value: number) {
    this._number = value;
    while (this._number != this.questionViewModel.options.length) {
      if(this._number > this.questionViewModel.options.length) {
        this.questionViewModel.options.push({ text:"", isRight: false });
      }
      else {
        this.questionViewModel.options.pop();
      }
    }
  }
  
  ngOnInit(): void {
    if(this.questionViewModel.options.length == 0) {
      this.number = 4;
    }
    else {
      this._number = this.questionViewModel.options.length;
    }
  }

}
