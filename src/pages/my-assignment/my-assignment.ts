import { filter } from 'rxjs/operator/filter';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { HttpServiceProvider } from '../../providers/http-service/http-service';

/**
 * Generated class for the MyAssignmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-assignment',
  templateUrl: 'my-assignment.html',
})
export class MyAssignmentPage {

  userId;
  mediaResoruces;
  userAssignedmediaResoruces;
  showMedia = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public localService: LocalStorageProvider,
    public httpService: HttpServiceProvider
  ) {
    this.userId = this.localService.getUsername;
    this.mediaResoruces = this.localService.getStoredMediaList;
    this.filterMediaResource();
  }
  filterMediaResource() {
    if (this.mediaResoruces || this.mediaResoruces.length) {
      let tempArray = this.mediaResoruces.filter(x => (x.AssignedBy == this.userId));
      let orgArray = JSON.parse(JSON.stringify(this.mediaResoruces));
      tempArray.forEach(function (elem) {
        let childArray = orgArray.filter(x => (x.ParentId == elem.Id));
        if (childArray) {
          elem.NLEList = [];
          elem.NLEList = childArray;
        }
      });
      this.userAssignedmediaResoruces = tempArray;
      console.log('filtermedia=>', this.mediaResoruces)
    }
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad MyAssignmentPage');
  }

}
