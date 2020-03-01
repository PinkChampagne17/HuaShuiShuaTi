import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuestionsService, Question, LibraryInfo } from 'src/app/Library/question-service';
import { QuestionsLocalStorageService } from 'src/app/services/questions-local-storage.service';
import { ProgressBarService } from 'src/app/services/progress-bar.service';

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

  @ViewChild("questionsContent", { static: true })
  public questionsContentElement: ElementRef;

  public contentSwitch: boolean;
  public questions: Array<Question>;
  public detail: AnswerDetail;

  private questionsService: IQuestionsService;
  private libraryInfo: LibraryInfo;

  constructor(
    private route: ActivatedRoute,
    private progressBarService: ProgressBarService,
    questionsLocalStorageService: QuestionsLocalStorageService) {

      this.questionsService = questionsLocalStorageService;

      let id = this.route.snapshot.paramMap.get('id');
      this.libraryInfo = this.questionsService.getAllLibraries().find(lib => lib.id == id);
      this.questions = this.questionsService.getAllQuestions(this.libraryInfo);

      this.reset();
  }

  nextQuestion(): void {
    this.contentSwitch = false;
    
    if(this.detail.isRight && !this.detail.isSkipped) {
      this.detail.rigthAnswers += 1;
    }

    this.detail.isAnswered = this.detail.isRight = this.detail.isSkipped = false;
    this.detail.index += 1;

    this.progressBarService.setValue(this.detail.index / this.questions.length * 100);

    if(this.detail.index == this.questions.length) {
      this.detail.isComplete = true;
      return;
    }

    setTimeout(() => {
      this.contentSwitch = true;
    }, 1);
  }

  reset() {
    this.detail = {
      index: 0,
      rigthAnswers: 0,
      isAnswered: false,
      isRight: false,
      isSkipped: false,
      isComplete: false
    }

    if(this.questions.length == 0) {
      this.detail.isComplete = true;
    }

    this.contentSwitch = true;
    this.progressBarService.setValue(0);
  }

  ngOnDestroy(): void {
    this.progressBarService.setValue(0);
  }
  
}
