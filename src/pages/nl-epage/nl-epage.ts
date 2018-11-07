import { Broadcaster } from './../../shared/broadcaster';
import { ISubscription } from 'rxjs/Subscription';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { MakeLoader } from '../../shared/makeLoader';
import * as _ from 'lodash';
import { NlePopOverComponent } from '../../components/nle-pop-over/nle-pop-over';
/**
 * Generated class for the NlEpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-nl-epage',
  templateUrl: 'nl-epage.html',
})
export class NlEpagePage {
  files: File[];
  resourceIndex;
  showMedia = false;
  mediaResources;
  resourcedId;
  selectedURL;
  commentBox: string = "";
  formData: FormData = new FormData();
  private subscription: ISubscription;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localStorage: LocalStorageProvider,
    public httpService: HttpServiceProvider,
    public makeLoader: MakeLoader,
    public broacaster: Broadcaster,
    public popoverCtrl: PopoverController,
  ) {
    this.getmediaResource();
    this.broacaster.on('nleChanges')
      .subscribe((data: any) => {
        let newarry = data;
        let b = "";
     
        if (data) {
          this.updateMediaList(newarry);
        }
      });
  }
  updateMediaList(media) {

    if (media || media.length) {
      for (let i = 0; i < media.length; i++) {
        let index = this.mediaResources.findIndex(x => x.Id == media[i].Id)
        if (index != -1) {
          // this.mediaResources[index] = media[i];
          this.mediaResources.splice(index, 1);
          // media.splice(i, 1)
        }
      }
      media = media.filter(x => x.IsAssignToNLE == true);
      media.forEach(element => {
        this.mediaResources.unshift(element);
      });

    }
    // this.filterMediaResource();
  }
  getmediaResource() {
    this.mediaResources = this.localStorage.getStoredMediaList;
    this.filterMediaResource();
  }
  filterMediaResource() {
    if (this.mediaResources || this.mediaResources.length) {
      this.mediaResources = this.mediaResources.filter(x => x.IsAssignToNLE == true);
    }
    this.mediaResources = _.sortBy(this.mediaResources, 'CreatedOn').reverse();
    console.log(this.mediaResources);
  }
  downloadMedia(resource) {
    this.httpService.insertToMediaDictionary(resource);

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
  sendBtn() {
    let loader = this.makeLoader.makeLoader('Uploading...');
    loader.present();
    this.formData.append('Comments', this.commentBox);
    this.httpService.uploadNleFile(this.formData)
      .subscribe((data: any) => {
        loader.dismiss();
        if (data) {
          if (data.Data.length > 0) {
            this.makeLoader.generateToast('File Uploaded Successfully')
            this.updateAssignNLEStatus();
          }
          else {
            this.makeLoader.generateToast('File Uploaded Failed')
          }
        }
        console.log("response", data);
      }, err => {
        loader.dismiss();
        this.makeLoader.generateToast('Network Error')
      });
  }
  private updateAssignNLEStatus() {
    this.httpService.UpdateAssignToNLEStatus(this.resourcedId)
      .subscribe(data => {
        if (data) {
          // this.mediaResources.splice(this.resourceIndex, 1);
        }
      });
  }

  handleFileInput(files: File, index, item) {

    if (files) {

      // let i = index.toString();
      let reader = new FileReader();

      reader.readAsDataURL(files[0]); // read file as data url

      reader.onload = (event: any) => {
        // called once readAsDataURL is completed
        this.selectedURL = event.target.result;
      }

      Object.assign(this.mediaResources[index], {
        Select: true,
      });
      this.resourcedId = item.Id;
      this.formData.append('fileKey', files[0], files[0].name);
      this.formData.append('fileName', files[0].name);
      this.formData.append('ParentId', item.Id);
      this.formData.append('Beat', item.Beat);
      this.formData.append('PackageType', item.PackageType);
      this.formData.append('FolderName', 'NLE');
      this.resourceIndex = index;
      // let popover = this.popoverCtrl.create(NlePopOverComponent);
      // popover.present();
      // popover.onDidDismiss(data => {

      //   if (data) {
      //     this.commentBox = data.data.Comment;
      //   }

      // });

      console.log('index=>', index);
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NlEpagePage');
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
