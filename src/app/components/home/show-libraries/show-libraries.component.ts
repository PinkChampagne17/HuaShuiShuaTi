import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserInfoLocalStorageService } from 'src/app/services/user-info-local-storage.service';
import { QuestionsLocalforageService } from 'src/app/services/questions-localforage.service';
import { ToastService } from 'src/app/services/toast.service';
import { DialogService, DialogData } from 'src/app/services/dialog.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { Library } from 'src/app/models/library';

interface AboutJson {
  version: string;
  name: string;
}

@Component({
  selector: 'app-show-libraries',
  templateUrl: './show-libraries.component.html',
  styleUrls: ['./show-libraries.component.scss']
})
export class ShowLibrariesComponent {

  public libraries: Array<Library>;
  
  public hasLoaded: boolean = false;
  public newLibraryName: string = "";
  public about: any = {
    version: "Loading...",
    name: "Loading...",
    year: new Date().getFullYear(),
  };

  @ViewChild("fileInput")
  private fileInputElement: ElementRef;

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private dialogService: DialogService,
    private toolbarService: ToolbarService,
    private userInfoService: UserInfoLocalStorageService,
    private questionService: QuestionsLocalforageService) {
    
    this.updateLibraries();
    this.toolbarService.greet();

    this.http.get<AboutJson>("assets/about.json").subscribe(result => {
      this.about.version = result.version;
      this.about.name = result.name;
    });
  }

  updateLibraries() {
    this.questionService.getAllLibraries().then(libs => {
      this.libraries = libs;
      this.hasLoaded = true;
    });
  }

  addLibrary() {
    let userInfo = this.userInfoService.getUserInfo();

    if(this.newLibraryName.trim() == ""){
      this.toastService.show("题库名不能为空");
      return;
    }
    if(userInfo == null) {
      this.toastService.show("创建题库前，请先设置用户名");
      return;
    }
    
    this.questionService.addLibrary(this.newLibraryName, userInfo.name, () => {
      this.toastService.show(`添加题库${this.newLibraryName}成功`);
      this.newLibraryName = "";
      this.updateLibraries();
    });
  }

  removeLibrary(id: string) {
    let dialogData: DialogData = { 
      title: "Are you sure?",
      content:`确认要删除题库 ${this.libraries.find(lib => lib.id == id).name} 吗？`
    };
    this.dialogService.openDialog(dialogData, result => {
      if (result) {
        this.questionService.removeLibrary(id);
        this.toastService.show("已删除");
        this.updateLibraries();
      }
    });
  }

  import(event: any) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = (() => {
      let result: string = typeof reader.result == 'string' ? reader.result : null;
      this.questionService.import(result).then(result => {
        if (result) {
          this.toastService.show("导入成功");
          this.updateLibraries();
        }
        else {
          this.toastService.show("导入失败");
        }
      });
    });

    reader.readAsText(input.files[0], 'utf-8');
  }

  importButtonClick() {
    this.fileInputElement.nativeElement.click();
  }
  
  isNoQuestion(libraryId: string): boolean {
    return this.questionService.getLibraryLength(libraryId) == 0;
  }

}
