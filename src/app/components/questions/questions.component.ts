import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Question } from 'src/app/lib/question-service';
import { ProgressBarService } from 'src/app/services/progress-bar.service';
import { QuestionsLocalforageService } from 'src/app/services/questions-localforage.service';
import { FisherYates } from 'src/app/lib/fisher-yates';

export interface AnswerDetail {
  index: number;
  rigthAnswers: number;
  isAnswered: boolean;
  isRight: boolean;
  isSkipped: boolean;
  isComplete: boolean;
}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent {

  public contentSwitch: boolean;
  public questions: Array<Question>;
  public detail: AnswerDetail;
  public hasLoaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private progressBarService: ProgressBarService,
    private questionsService: QuestionsLocalforageService) {

    this.reset(false);
  }

  async ngOnInit(): Promise<void> {
    let id = this.route.snapshot.paramMap.get('id');
    this.questionsService.getAllQuestions(id, true).then(questions => {
      this.questions = FisherYates.shuffle(questions);
      this.contentSwitch = true;
      this.hasLoaded = true;
    });
  }

  nextQuestion(): void {
    this.contentSwitch = false;
    
    if(this.detail.isRight && !this.detail.isSkipped) {
      this.detail.rigthAnswers += 1;
    }

    this.detail.isAnswered = this.detail.isRight = this.detail.isSkipped = false;
    this.detail.index += 1;

    this.progressBarService.setValue(this.detail.index / this.questions.length * 100);
    
    setTimeout(() => {
      this.contentSwitch = true;
    }, 1);

    if(this.detail.index == this.questions.length) {
      this.detail.isComplete = true;
      return;
    }
  }

  reset(canShuffle: boolean = true) {
    if (canShuffle) {
      this.questions = FisherYates.shuffle(this.questions);
    }

    this.detail = {
      index: 0,
      rigthAnswers: 0,
      isAnswered: false,
      isRight: false,
      isSkipped: false,
      isComplete: false
    }

    this.progressBarService.setValue(0);
  }

  ngOnDestroy(): void {
    this.progressBarService.setValue(0);
  }
  
}
