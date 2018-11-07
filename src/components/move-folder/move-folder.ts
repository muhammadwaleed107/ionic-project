import { StorageService } from './../../shared/storage.service';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { makeToast } from '../../shared/makeToast';

/**
 * Generated class for the MoveFolderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'move-folder',
  templateUrl: 'move-folder.html'
})
export class MoveFolderComponent {

  text: string;
  Folders =[];
  sStory;
  constructor(
    public viewCtrl: ViewController,
    public httpService: HttpServiceProvider,
    public StorageSerice: StorageService,
    public navParam: NavParams,
    public makeToast:makeToast
  ) {
     this.sStory = this.navParam.get('item');
    console.log('sotry',this.sStory);
    this.text = 'Hello World';
    if(this.getFolders){
      this.getFolders.forEach(element => {
          if(element.Type=='Public'){
            this.Folders.push(element);
          }
      });
    }
  }
  get getFolders() {
    let folders = this.StorageSerice.getProperty('ACLRights');
    if (folders) {
      return folders.Data.Folders
    }
    return folders
  }

  close(item) {
    // console.log(item);
    if(!this.sStory && !item){
      this.makeToast.generateToast('Something went Wrong');
      return
    }
    let sendObject = {
      Id:this.sStory.Id,
      FolderId:item.Id,
      LoginId:this.sStory.LoginId,
      CreatedBy:this.sStory.CreatedBy
    }
    console.log('HITOBJECT',sendObject);
    this.httpService.copyToNewsFolder(sendObject)
    .subscribe((data:any)=>{
      if(data){
        if(data.Data){
          this.makeToast.generateToast('News Move Successfully')
        }
      }
      console.log(data);
    },(err=>{
      this.makeToast.generateToast(`ERROR${err}`);
    }))
    this.viewCtrl.dismiss();
  }
}
