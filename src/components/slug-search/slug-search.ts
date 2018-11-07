import { NavParams } from 'ionic-angular/navigation/nav-params';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { StorageService } from '../../shared/storage.service';

/**
 * Generated class for the SlugSearchComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'slug-search',
  templateUrl: 'slug-search.html'
})
export class SlugSearchComponent {

  selectedCites = [];
  sc;
  searchText: string;
  Temp = [];
  slugSearch = false;
  UserID = {UserId:0}
 
  constructor(
    private params: NavParams,
    private viewCtrl: ViewController,
    private storageService: StorageService,
    private localStorage: LocalStorageProvider
  ) {
    console.log('Hello SlugSearchComponent Component');
    // let folder = params.get('folderList');
    let paramfolder = params.get('folderList');
    
    this.UserID = this.storageService.getProperty('UserCrd');

    if (paramfolder) {
      let folder = JSON.parse(JSON.stringify(paramfolder));
      folder.splice(0,1);
      this.selectedCites = folder;
    }
    else {
      this.getSlugWiseData();
      this.slugSearch = true;
    }
    // console.log(folder);
    this.Temp = this.selectedCites;
  }
  getSlugWiseData() {
    let slugWise = this.localStorage.getAllSlugs;
    if (slugWise) {
      slugWise.forEach(element => {
        this.selectedCites.push({
        Name: element.Text
        });
      });
    }
  }
  onSearchChange(searchValue: string) {
    this.selectedCites = this.Temp;
    let searchdata = this.selectedCites.filter(it => {
      return ((it.Name || "").toLowerCase()).includes(searchValue.toLowerCase()); // only filter country name
    });
    this.selectedCites = searchdata;
    //  console.log(searchdata);
  }
  select(sc) {
    this.sc = sc;
    this.viewCtrl.dismiss(this.sc);
    // console.log(sc);
  }

}
