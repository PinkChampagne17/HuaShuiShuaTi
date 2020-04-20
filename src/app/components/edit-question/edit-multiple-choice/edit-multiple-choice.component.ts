import { Component, Input } from '@angular/core';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-edit-multiple-choice',
  templateUrl: './edit-multiple-choice.component.html',
  styleUrls: ['./edit-multiple-choice.component.scss']
})
export class EditMultipleChoiceComponent {

  @Input()
  public questionViewModel: Question;
  
  private _number: number;

  public get number(): number {
    return this._number;
  }

  public set number(value: number) {
    this._number = value;
    while (this._number != this.questionViewModel.options.length) {
      if (this._number > this.questionViewModel.options.length) {
        this.questionViewModel.options.push({ text:"", isRight: false });
      }
      else {
        this.questionViewModel.options.pop();
      }
    }
  }
  
  public get rightOption(): number {
    let index = this.questionViewModel.options.findIndex(option => option.isRight == true);

    if(index == -1) {
      index = this.number - 1;
      console.log(index, this.questionViewModel.options)
      this.questionViewModel.options[index].isRight = true;
      console.log(index, this.questionViewModel.options)
    }
    
    return index;
  }

  public set rightOption(value: number) {
    this.questionViewModel.options[this.rightOption].isRight = false;
    this.questionViewModel.options[value].isRight = true;
  }
  
  ngOnInit(): void {
    if(this.questionViewModel.options.length == 0) {
      this.number = 4;
    }
    else {
      let allTrue = true;
      let allFalse = true;
      this.questionViewModel.options.forEach(option => {
        if(option.isRight) {
          allFalse = false;
        }
        else if(!option.isRight) {
          allTrue = false;
        }
      });

      for (let i = 0; i < this.questionViewModel.options.length; i++) {
        if(allTrue && i != 0) {
          this.questionViewModel.options[i].isRight = false;
        }
        else if(allFalse && i == 0) {
          this.questionViewModel.options[i].isRight = true;
        }
      }

      this._number = this.questionViewModel.options.length;
    }
  }

}
