import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { QuestionsLocalforageService } from 'src/app/services/questions-localforage.service';
import { ToastService } from 'src/app/services/toast.service';
import { Question } from 'src/app/models/question';
import { DialogService, DialogData } from 'src/app/services/dialog.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { ProgressBarService, ProgressBarMode } from 'src/app/services/progress-bar.service';
import { Library } from 'src/app/models/library';
import { QuestionType } from 'src/app/models/question-type';

@Component({
  selector: 'app-edit-library',
  templateUrl: './edit-library.component.html',
  styleUrls: ['./edit-library.component.scss']
})
export class EditLibraryComponent {

  public library: Library;
  public questions: Array<Question>;
  public hasLoaded: boolean = false;
  public newQuestionViewModel: Question;

  @ViewChild("exportElement")
  public exportElement: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private dialogService: DialogService,
    private toolbarService: ToolbarService,
    private progressbarService: ProgressBarService,
    private questionsService: QuestionsLocalforageService){
      
    let id = this.route.snapshot.paramMap.get('id');
    this.questionsService.getLibrary(id).then(lib => {
      this.library = lib;
      this.toolbarService.message = this.library.name;
      this.updateQuestions();
      this.resetViewModel();
    });
  }

  private resetViewModel() {
    this.newQuestionViewModel = {
      id: -1,
      title: "",
      type: QuestionType.MultipleChoice,
      options: [
        { text:"", isRight: false },
        { text:"", isRight: false },
        { text:"", isRight: false },
        { text:"", isRight: true }
      ],
      answerText: ""
    };
  }

  ngDoCheck(): void {
    this.progressbarService.setMode(this.hasLoaded ? ProgressBarMode.determinate : ProgressBarMode.indeterminate);
  }

  public toTypeName(typeValue: QuestionType) {
    return [
      { name:"选择题", value: QuestionType.MultipleChoice },
      { name:"多选题", value: QuestionType.MultipleAnswers },
      { name:"判断题", value: QuestionType.TureOrFalse },
      { name:"填空题", value: QuestionType.FillInTheBlank },
    ]
    .find( type => type.value == typeValue ).name;
  }

  updateQuestions() {
    this.questionsService.getAllQuestions(this.library.id).then((questions: Array<Question>) => {
      this.questions = questions.sort((a,b) => a.id - b.id);
      this.hasLoaded = true;
    });
  }

  renameLibrary() {
    this.questionsService.setLibraryName(this.library.id, this.library.name);
    this.toastService.show("已保存");
  }
  
  saveQuestion(id: number) {
    let question = this.questions.find(q => q.id == id);

    if (!this.questionCheck(question)) {
      return;
    }

    this.questionsService.setQuestion(this.library.id, question);
    this.toastService.show("已保存");
  }

  async removeQuestion(id: number) {
    let data: DialogData = { 
      title: "Are you sure?",
      content:`确认要删除该题吗？`
    };
    await this.dialogService.openDialog(data, input => {
      if (input) {
        this.questionsService.removeQuestion(this.library.id, id);
        this.questions.splice(this.questions.findIndex( q => q.id == id), 1);
        this.toastService.show("已删除");
      }
    });
  }

  async addQuestion() {
    if (!this.questionCheck(this.newQuestionViewModel)) {
      return;
    }
    await this.questionsService.addQuestion(this.library.id, this.newQuestionViewModel);
    this.toastService.show("添加完成");
    this.questions.push(this.newQuestionViewModel);
    this.resetViewModel();
  }

  questionCheck(question: Question): boolean {
    if(question.title.trim() == "") {
      this.toastService.show("题目不能为空");
      return false;
    }
    else if(question.type == QuestionType.FillInTheBlank && question.answerText.trim() == "") {
      this.toastService.show("答案文本不能为空");
      return false;
    }
    
    for (let i = 0; i < question.options.length; i++) {
      if(question.options[i].text.trim() == "") {
        this.toastService.show("选项文本不能为空");
        return false;
      }
    }

    return true;
  }

  subTitle(title: string): string {
    let maxLength = 17;
    if(title.length > maxLength) {
      title = title.substr(0, maxLength) + "...";
    }
    return title;
  }

  export() {
    console.log(this.exportElement);
    let element = this.exportElement.nativeElement;
    this.questionsService.export(this.library.id).then(result => {
      element.setAttribute('href',
        'data:text/plain;charset=utf-8,' + result);
      element.setAttribute('download', `${this.library.name}_${this.library.creater}.json`);
      element.click();
    });
    this.toastService.show("题库文件已添加至下载列表中");
  }

  scrollIntoView(elementId: string, isTopAlign = true, timeout = 0) {
    setTimeout(() => {
      document.getElementById(elementId).scrollIntoView(isTopAlign);
    }, timeout);
  }
}


