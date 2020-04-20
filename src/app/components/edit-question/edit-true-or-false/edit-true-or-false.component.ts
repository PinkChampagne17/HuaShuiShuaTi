import { Component, Input } from '@angular/core';
import { Question } from 'src/app/models/question';

@Component({
  selector: 'app-edit-true-or-false',
  templateUrl: './edit-true-or-false.component.html',
  styleUrls: ['./edit-true-or-false.component.scss']
})
export class EditTrueOrFalseComponent {

  @Input()
  public questionViewModel: Question;
  public isRight: string = "1";

  ngDoCheck(): void {
    this.questionViewModel.options = [
      { text: "正确", isRight: this.isRight == "1" },
      { text: "错误", isRight: this.isRight == "0" },
    ];
  }

  ngOnDestroy(): void {
    this.questionViewModel.options = [];
  }

}
