import { MenuBtnComponent } from './../../components/menu-btn/menu-btn';
import { ReportNewsPage } from './../report-news/report-news';
import { makeToast } from './../../shared/makeToast';
import { Component,  } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { StorageService } from '../../shared/storage.service';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { Broadcaster } from '../../shared/broadcaster';
import { ISubscription } from "rxjs/Subscription";
import { AddTickerComponent } from '../../components/add-ticker/add-ticker';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MakeLoader } from '../../shared/makeLoader';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { TickerDetailsComponent } from '../../components/ticker-details/ticker-details';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

/**
 * Generated class for the TickerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ticker',
  templateUrl: 'ticker.html',
})
export class TickerPage {


  formData: FormGroup;
  sndTicker = [];
  UserID;
  searchData: string = "";
  tickers: any = [{}];
  selectedSlug: string;
  placeHolder: string = "Search By Slug";
  showTickers: any = [];
  TempshowTickers: any = [];
  folderID;
  LastTickerSyncTime = '';
  localTicker: any = [];
  isLoading = true;
  orderBySlug = [];
  Slugs = [];
  isSearch = false;
  FolderWise: any = [];
  slugActive = true;
  SlugWise: any = [];

  private subscription: ISubscription;
  private isloadingsubscription: ISubscription
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public frbl: FormBuilder,
    public popoverCtrl: PopoverController,
    public httpService: HttpServiceProvider,
    public storageService: StorageService,
    public makeToast: makeToast,
    public modlCtrl: ModalController,
    public broacaster: Broadcaster,
    public makeLoader: MakeLoader,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public localStorage: LocalStorageProvider

  ) {
    this.UserID = this.storageService.getProperty('UserCrd') || '';
    // this.getGridTickerHit();
    this.isloadingsubscription = this.broacaster.on<string>('tickerLoading')
      .subscribe((data: any) => {
        this.isLoading = data;

      })
    this.folderID = this.storageService.getProperty('selectedfolderObject');
    // this.getLocalTickers();
    this.slugdata();
    // this.getTickerByPolling();
    this.subscription = this.broacaster.on<string>('newTicker')
      .subscribe((data: any) => {
        // this.getTickers();
        this.getLocalTickers();
      });
    this.broacaster.on<string>('getTickers')
      .subscribe(data => {
        this.getLocalTickers();
      })

    // this.getTickers();

    // this.createForm();
  }
  imageExists(url, callback) {
    var img = new Image();
    img.onload = function () { callback(true); };
    img.onerror = function () { callback(false); };
    img.src = url;
  }
  private getGridTickerHit() {
    let folderWise = this.localStorage.getFolderWise || [];
    let slugWise = this.localStorage.getSlugWise || [];
    if (folderWise.length < 1 || slugWise.length < 1) {
      this.httpService.getGridTicker()
        .subscribe((data: any) => {
          if (data) {
            this.FolderWise = data.Data.FolderWise;
            this.SlugWise = data.Data.SlugWise;

            this.localStorage.setSlugWise = this.SlugWise;
            this.localStorage.setFolderWise = this.FolderWise;
            this.slugdata();
          }
        });
    }
    else {
      this.FolderWise = folderWise;
      this.SlugWise = slugWise;
    }

  }

  getUserInitials(name) {

    var initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials;
  }
  getDate(datetime: string) {
    var date = new Date(datetime)
    return moment(date).format('L');

  }
  hideElementImage(image) {
  let result=  this.imageExists(image, data => {
      return data;
    });
    return result;
  }

  onGridViewChange(gridType) {
    if (gridType == "Folder Wise")
      this.folderData();
    if (gridType == "Slug Wise")
      this.slugdata();
  }
  geNametInitials(name) {
    var initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials;
  }
  hideElement(element) {
    element.target.parentElement.style.display = 'none'
    element.target.parentElement.nextElementSibling.style.display = 'initial';
  }

  openTickerDetails(slugname) {
    let tickerDetails;
    let tempList;
    // this.tickers.forEach(element => {
    //   debugger;
    //   if (element.Key == slugname) {
    //     tempList = element.Value;
    //     console.log('ALLTICKER=>', element.Value)
    //   }
    // });
    for (let i = 0; i < this.tickers.length; i++) {
      if (this.tickers[i].Key == slugname) {
        tempList = this.tickers[i].Value;
        // if (this.tickers[i].Value) {
        //   this.tickers[i].Value.forEach(element => {
        //     element.isRead = true;
        //   });
        // }
        // console.log('ALLTICKER=>', element.Value)
      }
    }
    // if (this.slugActive) {
    //   this.localStorage.setSlugWise = this.tickers;
    // }
    // else {
    //   this.localStorage.setFolderWise = this.tickers;
    // }
    tempList.forEach(element => {
      if (element.CreatedBy == this.UserID.UserId) {
        element.MyTicker = 'MyTicker';
      }
      else {
        element.MyTicker = 'Other';
      }
      var date = new Date(element.CreatedOn);
      element.TickerDate = moment(date).format('LL');
      element.IsFolderWise = !this.slugActive;
    });
    tickerDetails = tempList;
    this.storageService.setProperty('isTickerDetal',true);
    this.navCtrl.push(TickerDetailsComponent,{
      tickerDetails: tickerDetails,
        SlugName: slugname,
        slugActive: this.slugActive
    })
   
    this.broacaster.broadcast('mediaChanges',slugname);
    // let openModal = this.modlCtrl.create(TickerDetailsComponent, {
    //   tickerDetails: tickerDetails,
    //   SlugName: slugname,
    //   slugActive: this.slugActive
    // });
    // openModal.present();
    // openModal.onDidDismiss(data => {
    //   for (let i = 0; i < this.tickers.length; i++) {
    //     if (this.tickers[i].Key == slugname) {
    //       if (this.tickers[i].Value) {
    //         this.tickers[i].Value.forEach(element => {
    //           element.isRead = true;
    //         });
    //       }
    //       // console.log('ALLTICKER=>', element.Value)
    //     }
    //   }
    //   if (this.slugActive) {
    //     this.localStorage.setSlugWise = this.tickers;
    //     this.slugdata();
    //   }
    //   else {
    //     this.localStorage.setFolderWise = this.tickers;
    //     this.folderData();
    //   }
    // });
  }
  slugdata() {
    let notiCount = 0;
    this.SlugWise = this.localStorage.getSlugWise || [];
    this.slugActive = true;
    let data = [];
    this.showTickers = [];
    this.tickers = this.SlugWise;
    if (this.tickers) {
      this.tickers.forEach(element => {
        this.showTickers.push({
          Key: element.Key,
          lastupdate: _.sortBy(element.Value, 'CreatedOn').reverse()[0].CreatedOn,
          Value: _.sortBy(element.Value, 'CreatedOn').reverse()[0],
          TotalCount: element.Value.length,
          notiCount: this.getCount(element.Value),
          TickerList: element.Value
        });
      });
    }
    this.broacaster.broadcast('tickerNoti');
    this.showTickers = _.sortBy(this.showTickers, 'lastupdate').reverse();
    this.TempshowTickers = this.showTickers;
  }
  getCount(values) {
    let notiCount = 0;
    let userID = this.UserID.UserId;
    if (values) {
      values.forEach(element => {

        if (element.isRead == false && userID != element.CreatedBy) {
          notiCount++;
        }
      });
    }
    return notiCount
  }
  folderData() {
    this.FolderWise = this.localStorage.getFolderWise;
    this.slugActive = false;
    let data = [];
    this.showTickers = [];
    this.tickers = this.FolderWise;
    if (this.tickers) {
      this.tickers.forEach(element => {
        this.showTickers.push({
          Key: element.Key,
          lastupdate: _.sortBy(element.Value, 'CreatedOn').reverse()[0].CreatedOn,
          Value: _.sortBy(element.Value, 'CreatedOn').reverse()[0],
          TotalCount: element.Value.length,
          notiCount: this.getCount(element.Value),
        });
      });
    }
    this.broacaster.broadcast('tickerNoti');
    this.showTickers = _.sortBy(this.showTickers, 'lastupdate').reverse();
    this.TempshowTickers = this.showTickers;
  }
  getLocalTickers() {
    this.folderID = this.storageService.getProperty('selectedfolderObject');
    this.localTicker = [];
    let localtickers = this.storageService.getProperty('storedTicker') || [];
    if (localtickers) {
      localtickers.forEach(element => {
        if (this.folderID.Id == element.FolderId) {
          this.localTicker.push(element);
        }
      });
    }
    this.tickers = _.reverse(_.sortBy(this.localTicker, this.localTicker.CreatedOn));
    // this.localStorage.setSlugWise = this.SlugWise;
    // this.localStorage.setFolderWise = this.FolderWise;


    if (this.slugActive) {
      this.slugdata();
    }
    else {
      this.folderData();
    }
    // this.tickers = this.localTicker;
  }

  addNewTickers(data) {
    let storedTicker = this.storageService.getProperty('storedTicker') || [];
    data.Data.Tickers.forEach(element => {
      this.localTicker.push(element);
    });
    this.storageService.setProperty('storedTicker', this.localTicker);
    console.log(this.localTicker);
    this.tickers = _.reverse(_.sortBy(this.localTicker, this.localTicker.CreatedOn));
    // this.tickers = this.localTicker;
    this.LastTickerSyncTime = data.Data.LastTickerSyncTime;
    this.storageService.setProperty('LastTickerSyncTime', this.LastTickerSyncTime);
  }
  private getTickerByPolling() {
    this.folderID = this.storageService.getProperty('selectedfolderObject');
    this.httpService.getTickerByPolling()
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.Data.Tickers.length > 0) {
            this.addNewTickers(data);
          }
        }

      });
  }
  set setLocalStoregeTicker(storedTicker) {
    this.storageService.setProperty('storedTicker', storedTicker);
  }
  get LocalStorageTickers() {
    let localticker = this.storageService.getProperty('storedTicker') || [];
    return localticker;
  }
  createForm() {
    this.formData = this.frbl.group({
      Text: ['', Validators.required],
      FolderId: [this.folderID.id],
      CreatedBy: [this.UserID.UserId, Validators.required],
      LoginId: [this.UserID.FullName]
    });
  }
  getTime(datetime: string) {
    var date = new Date(datetime)
    var currDate = new Date();
    if (moment(date).format('L') == moment(currDate).format('L'))
      return moment(date).format('LT');
    else
      return moment(date).format('L');
  }
  getTickers() {
    this.folderID = this.storageService.getProperty('selectedfolderObject');
    this.httpService.getTickerbyFolderID((this.folderID.Id))
      .subscribe((data: any) => {
        if (data) {
          this.tickers = data.Data.Tickers;
          this.LastTickerSyncTime = data.Data.LastTickerSyncTime;
          this.storageService.setProperty('LastTickerSyncTime', this.LastTickerSyncTime);
        }
      });
    // this.httpService.getTicker().subscribe((data:any)=>{
    //   console.log(data)
    //   if(data){
    //     this.tickers = data.Data;
    //     this.tickers.reverse();
    //   }

    // })
  }
  resetData() {
    this.sndTicker = [];
    this.createForm()
  }
  getagoTime(datetime: string) {
    // let date =  (new Date(datetime)).toISOString();
    // console.log(date)
    return moment(datetime).fromNow();

  }

  presentPopover(myEvent: Event, item) {
    myEvent.stopPropagation();

    let popover = this.popoverCtrl.create(MenuBtnComponent, { item: item });
    popover.present({
      ev: myEvent
    });
  }
  openAddTicker() {
    let OpenModal = this.modlCtrl.create(AddTickerComponent);
    OpenModal.present();
    OpenModal.onDidDismiss(data => {
      // this.getTickers();
    });
  }
  submit() {
    let loader = this.loadingCtrl.create({
      content: "Please Wait...",
    })
    this.sndTicker.push(this.formData.value);
    this.httpService.insertTicker(this.formData.value)
      .subscribe((data: any) => {
        if (data) {
          if (data.Result) {
            this.makeToast.generateToast('Ticker Submitted');
            this.resetData();
            this.getTickers();
          }
          else {
            this.makeToast.generateToast('Ticker Failed');
          }
        }
        loader.dismiss();

      }, err => {
        loader.dismiss();
        this.makeToast.generateToast(`Error:${err.message}`);
      })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TickerPage');
  }
  clipToBoard(text) {
    let selBox = document.createElement('textarea');
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.makeToast.generateToast('Copied');
  }
  makeLoad() {
    let loader = this.loadingCtrl.create({
      content: "Please Wait...",
    })
    return loader;
  }
  deletStory(item: any, event: Event) {

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
    let loader = this.loadingCtrl.create({
      content: "Please Wait...",
    });
    loader.present();
    let storedNews = this.LocalStorageTickers;
    // this.spliceDeleteItem(storedNews, item);
    Object.assign(item, {
      IsDeleted: true,
    });
    this.httpService.deleteTicker(item)
      .subscribe((data: any) => {
        console.log(data);
        loader.dismiss();
        if (data) {
          if (data.Data) {
            this.setLocalStoregeTicker = storedNews;
            // this.broadCaster.broadcast('newNews');
            this.getLocalTickers();
            this.makeToast.generateToast('Successfully Deleted');
          }
        }
        // loader.dismiss();
      }, (err => {
        loader.dismiss();
        // loader.dismiss();
        this.makeToast.generateToast(`ERROR:${err}`);
      }));
  }

  // private spliceDeleteItem(storedNews: any, item: any) {
  //   for (let j = 0; j < storedNews.length; j++) {
  //     if (storedNews[j].Id == item.Id) {
  //       storedNews.splice(j, 1);
  //     }
  //   }
  // }
  isSearchTrue() {
    if (this.isSearch == false) {
      this.isSearch = true;

    }
    else {
      this.isSearch = false;
    }
  }
  onInput(event) {

    if (this.searchData == "") {
      // this.isSearch = false;
      if (this.slugActive) {
        this.slugdata();
      }
      else {
        this.folderData();
      }
      return
    }
    if (this.searchData.length > 2) {
      // this.isSearch = true;
      var tempTickers = [];
      setTimeout(() => {
        this.showTickers = [];
        this.showTickers = this.TempshowTickers.filter(it => {
          var isExistItem = it.TickerList.filter(tickerItem => {
            return ((tickerItem.Text || "").toLowerCase()).includes(this.searchData.toLowerCase())
          });
          var IsKeyExist = ((it.Key || "").toLowerCase()).includes(this.searchData.toLowerCase());
          if (IsKeyExist || (isExistItem && isExistItem.length > 0))
            return it;
        });
      }, 1000);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.isloadingsubscription.unsubscribe();
  }
}
