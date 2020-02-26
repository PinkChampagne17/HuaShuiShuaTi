import { Component, Input, ElementRef } from '@angular/core';

import { QuestionOption } from 'src/app/Library/question-service';
import { AnswerDetail } from '../questions.component';
import { FisherYates } from 'src/app/Library/fisher-yates';

interface OptionsViewModel {
  id: number;
  text: string;
}

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss']
})
export class MultipleChoiceComponent {
  
  @Input()
  public detail: AnswerDetail;
  @Input()
  public options: Array<QuestionOption>;
  @Input()
  public isTrueOrFalse: boolean;
  @Input()
  public questionsContentElement: ElementRef;

  public optionsViewModel: Array<OptionsViewModel> = [];
  public hoveringOptionId: number = -1;

  private rightOption: number;

  ngOnInit(): void {
    for (let i = 0; i < this.options.length; i++) {

      if(this.options[i].isRight) {
        this.rightOption = i;
      }

      this.optionsViewModel.push({
        id: i,
        text: this.options[i].text
      })
    }

    if(!this.isTrueOrFalse){
      this.optionsViewModel = FisherYates.shuffle(this.optionsViewModel);
    }
  }

  click(id: number) {
    if(this.detail.isAnswered) {
      return;
    }
    if(id == this.rightOption) {
      this.detail.isRight = true;
    }
    
    this.detail.isAnswered = true;

    setTimeout(() => {
      this.questionsContentElement.nativeElement.scrollIntoView(false);
    }, 500);
  }

  color(id: number): string {
    if(this.detail.isAnswered){
      return id == this.rightOption ? "success" : "accent";
    }
    else{
      return this.hoveringOptionId == id ? "hover" : "primary";
    }
  }

  mousemove(id: number){
    this.hoveringOptionId = id;
  }

  mouseout(){
    this.hoveringOptionId = -1;
  }

}
