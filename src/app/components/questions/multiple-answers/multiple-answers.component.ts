import { Component, OnInit, Input } from '@angular/core';

import { IQuestionsService, QuestionOption } from 'src/app/lib/question-service';
import { AnswerDetail } from '../questions.component';
import { FisherYates } from 'src/app/lib/fisher-yates';

@Component({
  selector: 'app-multiple-answers',
  templateUrl: './multiple-answers.component.html',
  styleUrls: ['./multiple-answers.component.scss']
})
export class MultipleAnswersComponent {

  @Input()
  public detail: AnswerDetail;
  @Input()
  public options: Array<QuestionOption>;

  input: Array<boolean> = [];

  ngOnInit() {
    for (let i = 0; i < this.options.length; i++) {
      this.input[i] = false;
    }

    this.options = FisherYates.shuffle(this.options);
  }



  ngDoCheck(): void {
    let flag = true;
    for (let i = 0; i < this.options.length; i++) {
      if(this.input[i] != this.options[i].isRight){
        flag = false;
      }
    }
    this.detail.isRight = flag;
  }

  color(isRight: boolean) {
    if(this.detail.isAnswered){
      return isRight ? '#28a745' : '#dc3545';
    }
    else{
      return '';
    }
  }

}
