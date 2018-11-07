import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../shared/storage.service';

/*
  Generated class for the LocalStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocalStorageProvider {
  ACLlist;
  constructor(
    public StroageService: StorageService
  ) {
    console.log('Hello LocalStorageProvider Provider');
  }

  get getStoredMediaList(){
    let mediaList = this.StroageService.getProperty('StoredMediaList') || [];
    return mediaList;
  }
  get getOGFoldersList() {
    let folderList = this.StroageService.getProperty('folders') || [];
  
    return folderList;
  }

  get getFoldersList() {
    let folderList = this.StroageService.getProperty('ACLRights') || [];
    if (folderList) {
      folderList = folderList.Data.Folders;
    }
    return folderList;
  }
  get getStoredTickers(){
    let storedTickers = this.StroageService.getProperty('storedTicker') || [];
    return storedTickers;
  }
  get getCategories(){
    let categorues = this.StroageService.getProperty('categories')|| [];
    return categorues;
  }
  get getACLList(){
    let ACLlist = this.StroageService.getProperty('ACLRights') || [];
    return ACLlist;
  }
  get getDeviceToken() {
    let deviceToken = this.StroageService.getProperty('deviceToken') || null;
    return deviceToken;
  }
  get getAllSlugs(){
    let slugs = this.StroageService.getProperty('slugs') || [];
    return slugs;
  }
  get getUserId() {
    let userId = this.StroageService.getProperty('UserCrd') || [];
    if (userId) {
      userId = userId.UserId;
    }
    return userId;
  }

  get getUsername() {
    
    let userName = this.StroageService.getProperty('UserCrd') || [];
    if (userName) {
      userName = userName.FullName;
    }
    return userName;
  }
   getfolderNameByID(folderID){
    let foldername ; 
    let folderList = this.getOGFoldersList;
    if (folderList.length) {
      folderList.forEach(element => {
        if (element.Id == folderID) {
          foldername = element.Name;
        }
      });
    }
    return foldername;
  }
  set setMediaSyncTime(data){
    this.StroageService.setProperty('LastMediaSyncTime',data);
  }
  set setStoredMediaList(data){
      this.StroageService.setProperty('StoredMediaList',data);
  }
  set setFolderWise(data){
    this.StroageService.setProperty('FolderWise',data);
  }
 
  set setSlugWise(data){
    this.StroageService.setProperty('SlugWise',data);
  }
  set setDeviceToken(token) {
     this.StroageService.setProperty('deviceToken',token);
  }
  get getSlugWise(){
    let slugWise = this.StroageService.getProperty('SlugWise');
    return slugWise;
  }
  get getFirstLogin(){
    let bit = this.StroageService.getProperty('firstLogin');
    return bit;
  }
  set setFirstLogin(bit){
    this.StroageService.setProperty('firstLogin',bit);
  }
  get getFolderWise(){
    let folderWise = this.StroageService.getProperty('FolderWise');
    return folderWise;
  }
}
