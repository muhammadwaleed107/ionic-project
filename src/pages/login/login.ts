import { ISubscription } from 'rxjs/Subscription';
import { MakeLoader } from './../../shared/makeLoader';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpServiceProvider } from './../../providers/http-service/http-service';
import { ILoginResponse } from '../../models/ILoginResponse';
import { makeToast } from './../../shared/makeToast';
import { StorageService } from '../../shared/storage.service';
import { ReportNewsPage } from './../report-news/report-news';
import { HomePage } from '../home/home';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { DashboardPage } from '../dashboard/dashboard';
import { GetToken } from './../../shared/getToken';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { Platform } from 'ionic-angular';
import { Broadcaster } from '../../shared/broadcaster';
import { FirebaseMessagingProvider } from '../../providers/firebase-provider/firebase-provider';
import { TickerPage } from '../ticker/ticker';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username;
  password;
  showContent = false;
  private subscription: ISubscription;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public makeToast: makeToast,
    public httpService: HttpServiceProvider,
    public storageService: StorageService,
    public menuCtrl: MenuController,
    public loadingCtrl: MakeLoader,
    public gettoken: GetToken,
    public localService: LocalStorageProvider,
    public platform: Platform,
    public broadcaster: Broadcaster,
    // private firebasmessaging : FirebaseMessagingProvider
  ) {
    this.menuCtrl.enable(false, 'menuleft');
    this.menuCtrl.enable(false, 'right');
    this.subscription = this.broadcaster.on<string>('login')
      .subscribe(data => {
        this.login();
      });
  }
  storeToken(data) {
    this.storageService.setProperty('UserCrd', data);
  }
  login() {

    if (this.platform.is('cordova')) {
      if (!this.localService.getDeviceToken) {
        this.gettoken.getDeviceToken();
        this.makeToast.generateToast('Fetching Token! try again later');
        // return;

      }
    }
    if (!this.localService.getDeviceToken) {
      // this.firebasmessaging.enableNotifications();
      this.makeToast.generateToast('Fetching Token! try again later');
      // return;
    }
    let loader = this.loadingCtrl.makeLoader('Please Wait..');
    loader.present();
    let crd = {
      LoginId: this.username,
      Password: this.password
    }
    this.httpService.loginapi(crd)

      .subscribe((data: ILoginResponse) => {
        if (data.Data.IsSuccess) {
          this.getControl(data);
          loader.dismiss();
          this.makeToast.generateToast('Please Wait');
          this.localService.setFirstLogin = 1;
          this.storeToken(data.Data.Data);

        }
        else {
          loader.dismiss();
          this.makeToast.generateToast('Login or Password is Incorrect');
        }
        console.log('data=>', data);
      }, (err => {
        loader.dismiss();
      }));

  }
  getControl(crd) {
    let loader = this.loadingCtrl.makeLoader('Fetching Data..');
    loader.present();
    let deviceToken = this.storageService.getProperty('deviceToken');
    if (deviceToken) {
      Object.assign(crd, { DeviceToken: deviceToken });
    }

    this.httpService.getControl(crd)
      .subscribe(data => {
        if (data) {
          loader.dismiss();
          this.storageService.setProperty('ACLRights', data);
          this.makeToast.generateToast('Successfully Login');
          this.navCtrl.setRoot(DashboardPage);
          // this.navCtrl.setRoot(da);
        }
        console.log(data)
      })
  }
  get checkisLoggedin() {
    let login = this.storageService.getProperty('UserCrd');
    if (login) {
      return true;
    }
    else {
      false;
    }
  }
  ionViewDidLoad() {

  }
  ionViewCanEnter() {
    if (this.checkisLoggedin) {
      this.navCtrl.setRoot(DashboardPage);
      // this.navCtrl.setRoot(TickerPage);
      return true;
    }
    else {
      this.showContent = true;
    }
    return true;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
