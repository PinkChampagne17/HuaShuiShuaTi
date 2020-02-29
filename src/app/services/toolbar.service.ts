import { Injectable } from '@angular/core';
import { UserInfoLocalStorageService } from './user-info-local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  public message: string  = "";

  constructor(private userInfoService: UserInfoLocalStorageService) { }

  public greet() {
    let userInfo = this.userInfoService.getUserInfo();
    let date = new Date();
    let month = date.getMonth();
    let day =  date.getDay();
    let hours = date.getHours();
    let hello;

    if(userInfo && userInfo.date && userInfo.date.getMonth() == month && userInfo.date.getDay() == day) {
      hello = "生日快乐";
    }
    else if(6 <= hours && hours <= 10) {
      hello = "早上好";
    }
    else if(11 <= hours && hours <= 13) {
      hello = "中午好";
    }
    else if(14 <= hours && hours <= 18) {
      hello = "下午好";
    }
    else {
      hello = "晚上好";
    }

    this.message = hello + (userInfo == null ? "" : `，${userInfo.name}`);
  }
}
