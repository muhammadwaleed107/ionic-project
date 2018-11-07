import { ReportNewsPage } from './../report-news/report-news';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { StorageService } from '../../shared/storage.service';
import * as moment from 'moment';
import { makeToast } from '../../shared/makeToast';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { MoveFolderComponent } from '../../components/move-folder/move-folder';
import { MakeLoader } from './../../shared/makeLoader';
import * as _ from 'lodash';

/**
 * Generated class for the MystoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mystory',
  templateUrl: 'mystory.html',
})
export class MystoryPage {
  folderId;
  news :any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpServiceProvider,
    public storageService: StorageService,
    public mdlCtrl: ModalController,
    public maketoast:makeToast,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public makeLoader:MakeLoader,
  ) {
    this.folderId = this.storageService.getProperty('ACLRights') || '';
    if (this.folderId) {
      this.folderId = this.folderId.Data.Folders[0];
      console.log('thisfodler', this.folderId);
    }
  }
  getagoTime(datetime: string) {
    // let date =  (new Date(datetime)).toISOString();
    // console.log(date)
    return moment(datetime).fromNow();

  }
  openCreateStory() {
    let OpenModal = this.mdlCtrl.create(ReportNewsPage, {
      myfolderid: this.folderId.Id,
    })

    OpenModal.onDidDismiss(data=>{
      // this.getStory();
      this.news.push(data.result[0]);
      this.news = _.reverse(_.sortBy(this.news, this.news.CreatedOn));
      // console.log("Newsdata=>",data)

    });
    OpenModal.present();
  }
  get userId(){
    let userId = this.storageService.getProperty('UserCrd') || null;
    return userId.UserId
  }
  editNews(enews) {
    let OpenModal = this.mdlCtrl.create(
      ReportNewsPage,
      { newsObject: enews,
        myfolderid: this.folderId.Id,
      },
    );

    OpenModal.onDidDismiss(data => {
      this.getStory();
    })
    OpenModal.present();
  }
  deleteMyStory(item, event:Event){
    event.stopPropagation();

    const confirm = this.alertCtrl.create({
      message: 'Are You Sure?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.confirmDelete(item);
            console.log('Agree clicked');
            
          }
        }
      ]
    });
    confirm.present();

  }
  private confirmDelete(item: any) {
    let loader = this.makeLoader.makeLoader('Please Wait...');
    loader.present();

    Object.assign(item, {
      IsDeleted: true,
    });
    this.httpService.deleteNews(item)
      .subscribe((data: any) => {
        loader.dismiss();
        if (data) {
          if (data.Data) {
            this.getStory();
            this.maketoast.generateToast('Succesfully Deleted');
          }
        }
      });
  }

  presentPopover(myEvent:Event,item){
    myEvent.stopPropagation();
    let popover = this.popoverCtrl.create(MoveFolderComponent,{item:item});
    popover.present({
      ev: myEvent
    });
  }
  getStory() {
    this.httpService.getAllNewsbyFolderID(this.folderId.Id, this.userId)
      .subscribe((data: any) => {
        if (data) {
          this.news = data.Data.News;
          this.news = _.reverse(_.sortBy(this.news, this.news.CreatedOn));
        }
      });
  }
  ionViewDidLoad() {
    this.getStory();
    console.log('ionViewDidLoad MystoryPage');
  }

}
