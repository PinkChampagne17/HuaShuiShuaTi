import { Component, Input } from '@angular/core';
import { Question } from 'src/app/lib/question-service';

@Component({
  selector: 'app-edit-fill-in-the-blank',
  templateUrl: './edit-fill-in-the-blank.component.html',
  styleUrls: ['./edit-fill-in-the-blank.component.scss']
})
export class EditFillInTheBlankComponent {

  @Input()
  public questionViewModel: Question;

  public get input() {
    return this.questionViewModel.answerText;
  }

  public set input(value: string) {
    this.questionViewModel.answerText = value.trim().toLowerCase();
  }

  ngOnInit() {
    this.questionViewModel.options = [];
  }

}
