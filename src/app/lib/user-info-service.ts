export interface IUserInfoService {
    isAvailable: boolean;
    setUserInfo(value: UserInfo): boolean;
    getUserInfo(): UserInfo;
}

export interface UserInfo{
    name: string;
    date: Date;
}