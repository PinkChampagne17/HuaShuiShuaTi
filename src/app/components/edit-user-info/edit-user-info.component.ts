import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { UserInfoLocalStorageService } from 'src/app/services/user-info-local-storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { UserInfo } from 'src/app/models/user-info';

export interface User {
  name: string;
  stinger: string;
}

@Component({
  selector: 'app-edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.scss']
})
export class EditUserInfoComponent {

  public input: string | User;
  public date: Date;
  public placeholder: string = "你的名字";

  constructor(
    private toastService: ToastService,
    private userInfoService: UserInfoLocalStorageService,
    private toolbarService: ToolbarService) {

    this.userInfoService = userInfoService;

    let userInfo = this.userInfoService.getUserInfo();
    if(userInfo != null){
      this.placeholder = userInfo.name;
      this.date = userInfo.date;
    }
  }
  
  save(): void {
    try {
      let name = typeof this.input == 'string' ? this.input : this.input.name;

      if(name.trim() == "") {
        throw "string is empty";
      }

      this.saveUserInfo({ name: name, date: this.date });
    }
    catch (error) {
      let userInfo = this.userInfoService.getUserInfo();

      if(userInfo != null && this.date != null) {
        this.saveUserInfo({ name: userInfo.name, date: this.date });
      }
      else {
        this.toastService.show("不接受空名字");
      }
    }
  }

  private saveUserInfo(userInfo: UserInfo): void {
    if(this.userInfoService.setUserInfo(userInfo)) {
      let option = this.options.find(opiton => opiton.name == name);
      let message =  option == null ? "保存成功" : option.stinger;

      this.toastService.show(message);
      this.toolbarService.greet();
    }
    else {
      this.toastService.show("保存失败");
    }
  }
  
  // Material Autocomplete
  
  filteredOptions: Observable<User[]>;
  myControl = new FormControl();
  options: User[] = [
    { name: "蔡徐坤", stinger: "🐔你太美" },
    { name: "吴亦凡", stinger: "你看这个面他又长又宽" },
    { name: "影流之主", stinger: "🕺🕺🕺这就是你分手的借口" },
  ];
  
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.options.slice())
      );
  }
    
  displayFn(user?: User): string | undefined {
    return user ? user.name : undefined;
  }

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
