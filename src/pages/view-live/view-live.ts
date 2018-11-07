import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the ViewLivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-live',
  templateUrl: 'view-live.html',
})
export class ViewLivePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private iab: InAppBrowser
  ) {

  }

  ionViewDidLoad() {
    // const browser = this.iab.create('https://election.bolnews.com/webrtcng/','_system');
    const browser = this.iab.create('https://nms.bolnetwork.com/livestreaming/','_system');
    this.navCtrl.setRoot(DashboardPage);
    console.log('ionViewDidLoad ViewLivePage');
  }

}
