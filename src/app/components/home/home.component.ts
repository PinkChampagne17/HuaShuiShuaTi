import { Component, ViewChild, ElementRef } from '@angular/core';

import { QuestionsLocalStorageService } from 'src/app/services/questions-local-storage.service';
import { UserInfoLocalStorageService } from 'src/app/services/user-info-local-storage.service';
import { ToastService, ToastBackgroundColor } from 'src/app/services/toast.service';
import { DialogService, DialogData } from 'src/app/services/dialog.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { LibraryInfo } from 'src/app/Library/question-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public libraries: Array<LibraryInfo>;
  public newLibraryName: string = "";

  @ViewChild("fileInput", { static: true })
  private fileInputElement: ElementRef;

  constructor(
    private toastService: ToastService,
    private dialogService: DialogService,
    private toolbarService: ToolbarService,
    private userInfoService: UserInfoLocalStorageService,
    private questionService: QuestionsLocalStorageService) {

    this.toolbarService.greet();
    this.updateLibraries();
  }

  updateLibraries() {
    this.libraries = this.questionService.getAllLibraries();
  }

  addLibrary() {
    let userInfo = this.userInfoService.getUserInfo();

    if(this.newLibraryName.trim() == ""){
      this.toastService.show("题库名不能为空", ToastBackgroundColor.danger, 5000);
      return;
    }
    else if(userInfo == null) {
      this.toastService.show("创建题库前，请先设置用户名", ToastBackgroundColor.danger, 5000);
      return;
    }
    
    this.questionService.addLibrary(this.newLibraryName, userInfo.name);
    this.toastService.show("添加成功", ToastBackgroundColor.success);
    this.newLibraryName = "";
    this.updateLibraries();
  }

  removeLibrary(id: string) {
    let dialogData: DialogData = { 
      title: "Are you sure?",
      content:`确认要删除题库 ${this.libraries.find(lib => lib.id == id).name} 吗？`
    };
    this.dialogService.openDialog(dialogData, result => {
      if(result) {
        this.questionService.removeLibrary(id);
        this.updateLibraries();
        this.toastService.show("已删除", ToastBackgroundColor.success);
      }
    });
  }

  import(event: any) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = (() => {
      let result: string = typeof reader.result == 'string' ? reader.result : null;
      if (result != null && this.questionService.import(result)) {
        this.toastService.show("导入成功", ToastBackgroundColor.success);
        this.updateLibraries();
      }
      else {
        this.toastService.show("导入失败", ToastBackgroundColor.danger, 5000);
      }
    });

    reader.readAsText(input.files[0], 'utf-8');
  }

  importButtonClick() {
    this.fileInputElement.nativeElement.click();
  }

}