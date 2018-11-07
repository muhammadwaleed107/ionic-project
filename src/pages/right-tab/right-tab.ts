import { makeToast } from './../../shared/makeToast';
import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { Broadcaster } from '../../shared/broadcaster';
import { ISubscription } from 'rxjs/Subscription';
import { StorageService } from '../../shared/storage.service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { PictureWebComponent } from '../../components/picture-web/picture-web';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { NlePopOverComponent } from '../../components/nle-pop-over/nle-pop-over';
import { Dictionary } from '../../shared/dictionary';
import 'rxjs/Rx';
import * as _ from 'lodash';
/**
 * Generated class for the RightTabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-right-tab',
  templateUrl: 'right-tab.html',
})
export class RightTabPage {
  mediaList = [];
  tempList = [];
  slugs = [];
  selectedSlug;
  private subscription: ISubscription;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpServiceProvider,
    public localService: LocalStorageProvider,
    public broacaster: Broadcaster,
    public storageService: StorageService,
    private photoViewer: PhotoViewer,
    public platform: Platform,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public makeToast: makeToast
  ) {

    this.slugs = this.getAllSlugs;
    this.subscription = this.broacaster.on('mediaChanges')
      .subscribe((data: any) => {

        let newarry = data;
        if (data instanceof Array) {

          this.updateMediaList(newarry);
        }
        else {
          // alert('Not an array');

          if (data == 'All') {
            this.selectedSlug = data;
            this.getMediaList();
          }
          else if (data != undefined) {
            this.getMediaList();
              this.selectedSlug = data;
            this.onSearchChange(data);
            console.log('SLUGDATA', data)
          }
          else {
            // this.updateMediaList(data);
            // this.getMediaList();
          }
        }
      });

    this.getMediaList();
    // console.log('this=>',this.navParams.get('data1'))
  }
  downloadFile(data) {
    var blob = new Blob([data], { type: 'application/zip' });
    var url = window.URL.createObjectURL(blob);
    window.open(url);
  }
  presentPopover(media: any, index) {
    console.log(media);

    let object = this.mediaList[index];

    // let index = this.mediaList.findIndex(x => x.Id === media.Id);

    let popover = this.popoverCtrl.create(NlePopOverComponent);
    popover.present();
    popover.onDidDismiss(data => {
      if (data) {

        if (data != null && data) {
          this.httpService.sendtoNLE(object.Id, data.data.Comment)
            .subscribe((data: any) => {
              if (data) {
                this.mediaList[index] = data.Data;
                this.makeToast.generateToast('Successfully Send to NLE');
                // this.localService.setStoredMediaList = this.mediaList;
              }
            });
        }
      }
    })
  }
  getBg(url) {
    var _urlTemp = url;
    _urlTemp = _urlTemp.replace(" ", "%20");
    return 'url(' + _urlTemp + ')';
  }
  get getAllSlugs() {
    let slugs = this.localService.getAllSlugs;
    return slugs;
  }
  updateMediaList(media) {



    if (media || media.length) {
      for (let i = 0; i < media.length; i++) {
        let index = this.mediaList.findIndex(x => x.Id == media[i].Id)
        if (index != -1) {
          this.mediaList[index] = media[i];
          media.splice(i, 1)
        }
      }
      media.forEach(element => {
        this.mediaList.unshift(element);
      });
      this.localService.setStoredMediaList = this.mediaList;
    }
  }
  getMediaList() {
    let storedMediaList = this.localService.getStoredMediaList;

    this.mediaList = storedMediaList;
    this.mediaList = _.sortBy(this.mediaList, 'CreatedOn').reverse();
    this.tempList = this.mediaList;
    // console.log('mediaList',this.mediaList);
    console.log('change');
  }
  onSelectChange(event) {
    console.log(event);
    if (event == "All") {
      this.getMediaList();
    }
    else {
      this.onSearchChange(event);
    }
  }
  onSearchChange(searchValue: string) {

    this.mediaList = this.tempList;
    let searchdata = this.mediaList.filter(it => {
      return ((it.Beat || "").toLowerCase()).includes(searchValue.toLowerCase()); // only filter country name
    });
    this.mediaList = searchdata;
    console.log('MediaList', this.mediaList);
  }
  openImg(SanPath) {

    if (this.platform.is('cordova')) {
      this.photoViewer.show(SanPath, 'Image', { share: true });
    }
    else {
      let modal = this.modalCtrl.create(
        PictureWebComponent,
        {
          imgURL: SanPath
        });
      modal.present();
    }
  }
  openVideoModal(videoURL) {

    videoURL.replace("\\10.3.12.143", "http:\\10.3.12.143:85");
    let modal = this.modalCtrl.create(
      PictureWebComponent,
      {
        videoURL: videoURL
      });
    modal.present();
    console.log('thisis Video', videoURL)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RightTabPage');
  }
  ngOnDestroy() {
    // this.getMediaList();
    // this.storageService.setProperty('isTickerDetal', false);
    this.subscription.unsubscribe();
  }

  downloadMedia(resource) {
    //this.httpService.insertToMediaDictionary(resource);

    this.httpService.getDownloadMedia(resource.Id)
      .subscribe((data: any) => {
        if (data) {
          console.log(data);
          var link = document.createElement("a");
          link.download = data.Data.Name;
          link.target = "_blank";
          link.href = data.Data.URL;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
  }

}
