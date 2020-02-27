import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { QuestionsLocalStorageService } from 'src/app/services/questions-local-storage.service';
import { LibraryInfo, Question, QuestionType } from 'src/app/Library/question-service';
import { ToastService, ToastBackgroundColor } from 'src/app/services/toast.service';
import { DialogService, DialogData } from 'src/app/services/dialog.service';
import { ToolbarService } from 'src/app/services/toolbar.service';

@Component({
  selector: 'app-edit-library',
  templateUrl: './edit-library.component.html',
  styleUrls: ['./edit-library.component.scss']
})
export class EditLibraryComponent {

  public libraryName: string;
  public libraryInfo: LibraryInfo;
  public questions: Array<Question>;
  public newQuestionViewModel: Question;

  @ViewChild("content", { static: true })
  private contentElement: ElementRef;
  @ViewChild("exportElement", { static: true })
  private exportElement: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private toastService: ToastService,
    private dialogService: DialogService,
    private toolbarService: ToolbarService,
    private questionService: QuestionsLocalStorageService){
      
    this.questionService = questionService;
    
    let id: string = this.route.snapshot.paramMap.get('id');
    this.libraryInfo = this.questionService.getAllLibraries().find(lib => lib.id == id);
    this.questions = this.questionService.getAllQuestions(this.libraryInfo);
    this.toolbarService.message = this.libraryName = this.libraryInfo.name;

    this.newQuestionViewModel =  {
      id: -1,
      title: "",
      type: QuestionType.MultipleChoice,
      options: [],
      answerText: ""
    };
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

  ngOnDestroy() {
    this.questionService.setLibraryName(this.libraryInfo, this.libraryName);
  }

  updateQuestions() {
    this.questions = this.questionService.getAllQuestions(this.libraryInfo);
  }

  saveQuestion(id: number) {
    if(!this.questionCheck(this.questions.find(q => q.id == id))) {
      return;
    }
    this.questionService.setQuestion(this.libraryInfo, id, this.questions.find(q => q.id == id));
    this.toastService.show("已保存", ToastBackgroundColor.success);
  }

  removeQuestion(id: number) {
    let data: DialogData = { 
      title: "Are you sure?",
      content:`确认要删除该题吗？`
    };
    this.dialogService.openDialog(data, result => {
      if(result) {
        this.questionService.removeQuestion(this.libraryInfo, id);
        this.updateQuestions();
        this.toastService.show("已删除", ToastBackgroundColor.success);
      }
    });
  }

  addQuestion() {
    if(!this.questionCheck(this.newQuestionViewModel)) {
      return;
    }

    this.questionService.addQuestion(this.libraryInfo, this.newQuestionViewModel);
    
    this.newQuestionViewModel.title = "";
    this.newQuestionViewModel.answerText = "";
    this.newQuestionViewModel.options.forEach(option => option.text = "");
    
    this.toastService.show("添加完成", ToastBackgroundColor.success);
    this.updateQuestions();
  }

  questionCheck(question: Question): boolean {
    if(question.title.trim() == "") {
      this.toastService.show("题目不能为空", ToastBackgroundColor.danger, 5000);
      return false;
    }
    else if(question.type == QuestionType.FillInTheBlank && question.answerText.trim() == "") {
      this.toastService.show("答案文本不能为空", ToastBackgroundColor.danger, 5000);
      return false;
    }
    
    for (let i = 0; i < question.options.length; i++) {
      if(question.options[i].text.trim() == "") {
        this.toastService.show("选项文本不能为空", ToastBackgroundColor.danger, 5000);
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
    let element = this.exportElement.nativeElement;
    element.setAttribute('href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(this.questionService.export(this.libraryInfo)));
    element.setAttribute('download', `${this.libraryInfo.name}_${this.libraryInfo.creater}.json`);
    element.click();
    this.toastService.show("题库文件已添加至下载列表中", ToastBackgroundColor.success, 5000);
  }

  scrollIntoView(elementId: string, isTopAlign = true, timeout = 0) {
    setTimeout(() => {
      document.getElementById(elementId).scrollIntoView(isTopAlign);
    }, timeout);
  }

}


