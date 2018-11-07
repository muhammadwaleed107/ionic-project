import { NlEpagePage } from './../pages/nl-epage/nl-epage';
import { makeToast } from './../shared/makeToast';
import { Broadcaster } from './../shared/broadcaster';

import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { IMenuList } from '../models/IMenuList';
import { FCM } from '@ionic-native/fcm';
import { Nav } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { ReportNewsPage } from '../pages/report-news/report-news';
import { TickerPage } from '../pages/ticker/ticker';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { LoginPage } from '../pages/login/login';
import { StorageService } from '../shared/storage.service';
import { NewsStoryPage } from '../pages/news-story/news-story';
import { IFolderObject } from '../models/folderObject';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { FolderDropdownComponent } from '../components/folder-dropdown/folder-dropdown';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { MystoryPage } from '../pages/mystory/mystory';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { InAppBrowserPage } from '../pages/in-app-browser/in-app-browser';
import { ViewLivePage } from '../pages/view-live/view-live';
import { GetToken } from './../shared/getToken';
import { MakeLoader } from '../shared/makeLoader';
import { FirebaseMessagingProvider } from '../providers/firebase-provider/firebase-provider';
import { MyAssignmentPage } from '../pages/my-assignment/my-assignment';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  pages: Array<{ title: string, component: any, selected: boolean }>;
  menuList: IMenuList[];
  pagesArray = [];
  isLogin = false;
  tickerCount = 0;
  selectedfolderObject: IFolderObject = {
    Name: "",
    folderId: 0,
    id: "",
    type: "",
  }
  folders: IFolderObject[];
  crdPages: any = [];
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storageService: StorageService,
    public modalController: ModalController,
    public menuCtrl: MenuController,
    private httpService: HttpServiceProvider,
    private localService: LocalStorageProvider,
    private fcm: FCM,
    private broadcast: Broadcaster,
    private maketoast: makeToast,
    private makeloader: MakeLoader,
    private gettoken: GetToken,
    // private firebasmessaging : FirebaseMessagingProvider
  ) {
    this.initializeApp();
    this.httpService.startPolling();
    this.tickerNotiCount();
    broadcast.on<string>('tickerNoti')
      .subscribe((data: any) => {
        this.tickerNotiCount();
      });
    // this.httpService.NewsDeletionPolling();
    // this.httpService.TickerDeletionPolling();
    broadcast.on<string>('getMenuList')
      .subscribe((data: any) => {
        // this.menuList = data;
        // console.log(data);

        this.menuUpdate()

        // this.setFolder();
        if (this.checkisLoggedin) {
          this.isLogin = true;
          this.menuCtrl.enable(true, 'menuleft');
          this.menuCtrl.enable(true, 'right');
        }
      });
    this.pages = [
      // { title: 'Dashboard', component: TickerPage },
      { title: 'Ticker', component: DashboardPage, selected: true },
      { title: 'Story', component: NewsStoryPage, selected: false },
      { title: 'My Story', component: MystoryPage, selected: false },
      { title: 'Go Live', component: InAppBrowserPage, selected: false },
      { title: 'View Live', component: ViewLivePage, selected: false },
      { title: 'NLE Assignment', component: NlEpagePage, selected: false },
      { title: 'My Assignment', component: MyAssignmentPage, selected: false },
      
      // { title: 'DashboardPage', component: DashboardPage },

    ];

    //  console.log('menulust', this.menuList);
  }
  tickerNotiCount() {
    this.tickerCount = 0;
    let tickers = this.localService.getSlugWise;
    if (tickers) {
      for (let i = 0; i < tickers.length; i++) {
        tickers[i].Value.forEach(element => {
          if (element.isRead==false) {
            this.tickerCount++;
          }
        });
      }

    }
  }

  // setFolder(){
  //   this.folders = this.crdPages.Data.Folders || [];
  //   if(this.folders){
  //   this.selectedfolderObject =  this.folders[0];
  //   this.storageService.setProperty('selectedfolderObject',this.selectedfolderObject);
  //   }
  // }
  get checkisLoggedin() {
    let login = this.storageService.getProperty('UserCrd');
    if (login) {
      return true;
    }
    else {
      false;
    }
  }
  logout() {
    let loader = this.makeloader.makeLoader('Please Wait');
    loader.present();
    let deviceToken = this.localService.getDeviceToken;
    let UserId = this.localService.getUserId;
    let foldersList = this.localService.getFoldersList;

    let logoutObj = {
      DeviceToken: deviceToken,
      UserId: UserId.toString(),
      Folders: foldersList || []
    }

    this.httpService.logoutapi(logoutObj)
      .subscribe((data: any) => {
        if (data) {
          this.httpService.stopPollingByLocal();
          this.storageService.removeAll();
          this.nav.setRoot(LoginPage);
          loader.dismiss();
        }
        else {
          this.maketoast.generateToast("Server Error");
          loader.dismiss();
        }

      },
        err => {
          this.maketoast.generateToast("Network Error");
          loader.dismiss();
        }
      );
  }
  openFolderModal() {
    let openModal = this.modalController.create(FolderDropdownComponent, {
      folders: this.folders
    });
    openModal.present();
    openModal.onDidDismiss(data => {
      if (data) {
        this.selectedfolderObject = data;
        this.storageService.setProperty('selectedfolderObject', this.selectedfolderObject);
        console.log("dataDISmiss=>", data);
        this.broadcast.broadcast('getNews');
        this.broadcast.broadcast('getTickers');
      }
    })

  }
  menuUpdate() {
    this.pagesArray = [];
    this.crdPages = this.storageService.getProperty('ACLRights') || [];
    this.pages.forEach(element => {
      if (this.crdPages) {
        this.crdPages.Data.ACLRights
          .forEach(data => {
            if (element.title == data.ControlId) {
              this.pagesArray.push(element);
            }
          })
      }
    });
    console.log(this.pagesArray);
  }
  storeNews(data) {
    try {
      let parsedData = JSON.parse(data.data);
      let storedNews = this.storageService.getProperty('storedNews') || [];
      let temp = [];
      temp.push(parsedData);
      if (storedNews) {
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < storedNews.length; j++) {
            if (temp.length > 0) {
              if (storedNews[j].Id == temp[i].Id) {
                storedNews[j] = temp[i];
                temp.splice(i, 1);
                //delete here
              }
            }
          }
          // storedNews.forEach(element => {
          // });
        }
      }
      temp.forEach(element => {
        storedNews.push(element);
      });
      this.storageService.setProperty('storedNews', storedNews);
      this.broadcast.broadcast('newNews');
      // let storedNews = this.storageService.getProperty('storedNews')|| [];
      // let parsedData = JSON.parse(data.data);
      // storedNews.push(parsedData);
      // this.storageService.setProperty('storedNews',storedNews);
    } catch (error) {
      this.maketoast.generateToast('Something Went Wrong')
    }
  }
  storeTicker(data) {
    let storedTicker = this.storageService.getProperty('storedTicker') || [];
    let temp = [];
    try {
      temp.push(JSON.parse(data.data) || []);
      if (storedTicker) {
        for (let i = 0; i < temp.length; i++) {
          for (let j = 0; j < storedTicker.length; j++) {
            if (temp.length > 0) {
              if (storedTicker[j].Id == temp[i].Id) {
                storedTicker[j] = temp[i];
                temp.splice(i, 1);
              }
            }
          }
          // storedNews.forEach(element => {
          // });
        }
      }
      temp.forEach(element => {
        storedTicker.push(element);
      });
      this.storageService.setProperty('storedTicker', storedTicker);
      this.broadcast.broadcast('newTicker');
    } catch (error) {
      this.maketoast.generateToast('Something Went Wrong')
    }

    // let storedTicker = this.storageService.getProperty('storedTicker')|| [];
    // let parsedData = JSON.parse(data.data);
    // storedTicker.push(parsedData);
    // this.storageService.setProperty('storedTicker',storedTicker);
  }
  notificationHandler(data) {
    if (data) {
      // let saveNoti = this.storageService.getProperty('notificationdata') || [];
      // saveNoti.push(data);
      // this.storageService.setProperty('notificationdata', saveNoti);
      if (data.type == '1') {
        //news
        this.storeNews(data);
        this.broadcast.broadcast('newNews');

      }
      else if (data.type == '2') {
        //ticker
        this.broadcast.broadcast('newTicker');
        this.storeTicker(data);
      }
    }
  }
  private initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (this.platform.is('cordova')) {
        this.fcm.subscribeToTopic('all');
        // this.fcm.getToken().then(token => {
        //   localStorage.setItem('deviceToken', JSON.stringify(token));
        //   console.log('token:', token);
        //   // backend.registerToken(token);
        // });
        this.gettoken.getDeviceToken();
        this.fcm.onNotification().subscribe(data => {
          // alert('message received')

          console.log("NotifcatioNData=>", data);
          if (data.wasTapped) {
            // localStorage.setItem('mydata',JSON.stringify(data));
            // console.log(data);
            this.notificationHandler(data);
            console.info("Received in background");
          } else {
            //localStorage.setItem('mydata',JSON.stringify(data));

            // console.log(data);
            console.info("Received in foreground");
          };
        });
        this.fcm.onTokenRefresh().subscribe(token => {
          // backend.registerToken(token);
        });
        // You're on a device, call the native plugins. Example:
        //
        // var url: string = '';
        //
        // Camera.getPicture().then((fileUri) => url = fileUri);
      } else {
        // You're testing in browser, do nothing or mock the plugins' behaviour.
        //
        // var url: string = 'assets/mock-images/image.jpg';
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.pagesArray.forEach(data => {
      data.selected = false;
    });

    page.selected = true;

    this.nav.setRoot(page.component);
  }

}

