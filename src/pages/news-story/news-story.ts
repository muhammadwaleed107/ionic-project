import { NewsCommentsComponent } from './../../components/news-comments/news-comments';
import { ReportNewsPage } from './../report-news/report-news';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { StorageService } from '../../shared/storage.service';
import { Broadcaster } from '../../shared/broadcaster';
import { ISubscription } from 'rxjs/Subscription';
import * as moment from 'moment';
import { makeToast } from '../../shared/makeToast';
import { MakeLoader } from '../../shared/makeLoader';
import * as _ from 'lodash';
import { AlertController } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
/**
 * Generated class for the NewsStoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-news-story',
  templateUrl: 'news-story.html',
})
export class NewsStoryPage {
  news = [];
  folderObject;
  UserObject;
  LastNewsSyncTime = '';
  folderID;
  localNews;
  categouries = [];
  isLoading = true;
  private subscription: ISubscription;
  private isloadingsubscription: ISubscription

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modlCtrl: ModalController,
    public storageService: StorageService,
    public httpService: HttpServiceProvider,
    public broadCaster: Broadcaster,
    public makeToast: makeToast,
    public broacaster: Broadcaster,
    public makeLoader: MakeLoader,
    public alertCtrl: AlertController,
    public localService: LocalStorageProvider
  ) {

    this.isloadingsubscription = this.broacaster.on<string>('newsLoading')
      .subscribe((data: any) => {
        this.isLoading = data;
      })
    this.getLocalNews();
    this.subscription = this.broadCaster.on<string>('getNews')
      .subscribe((data: any) => {
        // this.getNews();
        this.getLocalNews()
      })
    this.subscription = this.broadCaster.on<string>('newNews')
      .subscribe((data: any) => {
        // this.getNews();
        this.getLocalNews()
      })
    // this.categouries = this.localService.getCategories;
    // this.getNews();
  }
  openCommentsModal(event: Event) {
    event.stopPropagation();
    console.log('working')
    let modal  = this.modlCtrl.create(NewsCommentsComponent,{
      commentsData:'test'
    });
    modal.present();
  }
  set setLocalStoregeNews(storedNews) {

    this.storageService.setProperty('storedNews', storedNews);
  }

  get LocalStorageNews() {
    let localnews = this.storageService.getProperty('storedNews') || [];
    return localnews;
  }
  getLocalNews() {
    this.folderID = this.storageService.getProperty('selectedfolderObject');
    this.localNews = [];
    let localnews = this.LocalStorageNews;
    if (localnews) {
      localnews.forEach(element => {
        if (this.folderID.Id == element.FolderId) {
          this.localNews.push(element);
        }
      });
    }
    this.news = _.reverse(_.sortBy(this.localNews, this.localNews.CreatedOn));
    // this.news = this.localNews;

  }
  getCategoury(id) {
    this.categouries.forEach(element => {
      if (id == element.Id) {
        return element.Category
      }
    })
  }
  openCreateStory() {
    let OpenModal = this.modlCtrl.create(ReportNewsPage);
    OpenModal.onDidDismiss(data => {
      // console.log(data);
      // this.getNews();
    });
    OpenModal.present();
  }
  getagoTime(datetime: string) {
    // let date =  (new Date(datetime)).toISOString();
    // console.log(date)
    return moment(datetime).fromNow();

  }
  getNews() {
    this.folderObject = this.storageService.getProperty('selectedfolderObject');
    this.UserObject = this.storageService.getProperty('UserCrd');
    this.httpService.getAllNewsbyFolderID(this.folderObject.Id, this.UserObject.UserId)
      .subscribe((data: any) => {
        if (data) {
          this.news = data.Data.News;
          this.LastNewsSyncTime = data.Data.LastNewsSyncTime;
          this.storageService.setProperty('LastNewsSyncTime', this.LastNewsSyncTime);
        }
        console.log(data);
      });
  }
  editNews(enews) {
    let OpenModal = this.modlCtrl.create(
      ReportNewsPage,
      { newsObject: enews },
    );

    OpenModal.onDidDismiss(data => {
      // this.getNews();
    })
    OpenModal.present();
  }

  clipToBoard(text, event: Event) {

    event.stopPropagation();
    let selBox = document.createElement('textarea');
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.makeToast.generateToast('Copied');
  }

  deleteStory(item: any, event: Event) {

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
    let storedNews = this.LocalStorageNews;
    // this.itemSplice(storedNews, item);
    Object.assign(item, {
      IsDeleted: true,
    });
    this.httpService.deleteNews(item)
      .subscribe((data: any) => {
        console.log(data);
        loader.dismiss();
        if (data) {
          if (data.Data) {
            this.setLocalStoregeNews = storedNews;
            this.broadCaster.broadcast('newNews');
            this.makeToast.generateToast('Successfully Deleted');
          }
        }
      }, (err => {
        loader.dismiss();
        this.makeToast.generateToast(`ERROR:${err}`);
      }));
  }

  private itemSplice(storedNews: any, item: any) {
    for (let j = 0; j < storedNews.length; j++) {
      if (storedNews[j].Id == item.Id) {
        storedNews.splice(j, 1);
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsStoryPage');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
