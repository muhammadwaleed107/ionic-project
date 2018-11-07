import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Platform } from 'ionic-angular/platform/platform';
import { DashboardPage } from '../dashboard/dashboard';
import { StorageService } from '../../shared/storage.service';

/**
 * Generated class for the InAppBrowserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-in-app-browser',
  templateUrl: 'in-app-browser.html',
})
export class InAppBrowserPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private iab: InAppBrowser,
    private browserTab: BrowserTab,
    public platform: Platform,
    public storageService:StorageService
  ) {
    let username = this.storageService.getProperty('UserCrd') || [];
    if(username){
      username = username.FullName;
    }
    let randomNumber = Math.floor((Math.random() * 99999999) + 1);
    console.log("randomnumber",randomNumber);
    if (platform.is('android') && platform.is('cordova')) {
      browserTab.isAvailable()
        .then(isAvailable => {
          if (isAvailable) {
            // browserTab.openUrl(`https://election.bolnews.com/webrtcng/?room=${randomNumber}&caller=1&user=${username}`);
            browserTab.openUrl(`https://nms.bolnetwork.com/livestreaming/?room=${randomNumber}&caller=1&user=${username}`);

            // browserTab.openUrl('https://election.bolnews.com/webrtc/');
          } else {
            // const browser = this.iab.create('https://election.bolnews.com/webrtc/', '_system');
            const browser = this.iab.create(`https://nms.bolnetwork.com/livestreaming/?room=${randomNumber}&caller=1&user=${username}`, '_system');
            // open URL with InAppBrowser instead or SafariViewController
            // open URL with InAppBrowser instead or SafariViewController
          }
        });
        this.navCtrl.setRoot(DashboardPage);
      }
    else{

        const browser = this.iab.create(`https://nms.bolnetwork.com/livestreaming/?room=${randomNumber}&caller=1&user=${username}`,'_system');
        this.navCtrl.setRoot(DashboardPage);
    }

    // browser.executeScript(...);

    // browser.insertCSS(...);
    // browser.on('loadstop').subscribe(event => {
    //   browser.insertCSS({ code: "body{color: red;" });
    // });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InAppBrowserPage');
  }

}
