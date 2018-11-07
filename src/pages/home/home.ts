import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FileServiceProvider } from './../../providers/file-service/file-service';
import { IMenuList } from '../../models/IMenuList';
import { Broadcaster } from '../../shared/broadcaster';
import { StorageService } from '../../shared/storage.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  menuItems:IMenuList;
  userName;
  constructor(
    public navCtrl: NavController,
    public fileService: FileServiceProvider,
    public broadcaster:Broadcaster,
    public StorageService:StorageService
  ) {
    this.userName = (this.StorageService.getProperty('UserCrd')).FullName || {FullName:""}
    this.fileService.getmenuJson().subscribe((data:IMenuList)=>{
      this.menuItems = data;
        this.broadcaster.broadcast('getMenuList',this.menuItems);
    });

  }

}
