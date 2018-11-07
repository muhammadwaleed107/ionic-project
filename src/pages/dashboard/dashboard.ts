import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewsStoryPage } from '../news-story/news-story';
import { TickerPage } from '../ticker/ticker';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { FolderDropdownComponent } from '../../components/folder-dropdown/folder-dropdown';
import { StorageService } from '../../shared/storage.service';
import { IFolderObject } from '../../models/folderObject';
import { Broadcaster } from '../../shared/broadcaster';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  tab1Root = NewsStoryPage;
  tab2Root = TickerPage;
  showMedia = false;
  rootPage: any = TickerPage;
  folders: IFolderObject[];
  selectedfolderObject: IFolderObject = {
    Name: "",
    folderId: 0,
    id: "",
    type: "",
  }
  crdPages: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalController: ModalController,
    public storageService: StorageService,
    public broadcaster: Broadcaster,
    public httpService: HttpServiceProvider
  ) {
    // this.httpService.startPolling();
    this.httpService.startPollingByLocal();
    this.crdPages = this.storageService.getProperty('ACLRights') || [];
    this.setFolder();
    this.broadcaster.broadcast('getMenuList');
    this.httpService.getGeneric()
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.setLocations = data.Data.Locations;
          this.setCategories = data.Data.Categories;
          this.setSlugs = data.Data.Slugs;
          this.setFoldersList = data.Data.Folders;
        }
      })
  }
  showMediaChange(){
    console.log('media',this.showMedia);
  }
  set setCategories(location){
    this.storageService.setProperty('categories',location)
  }
  set setSlugs(slugs) {
    this.storageService.setProperty('slugs', slugs)
  }
  set setLocations(location){
    this.storageService.setProperty('locations',location)
  }
  set setFoldersList(folders) {
    this.storageService.setProperty('folders', folders)
  }
  setFolder() {
    this.folders = this.crdPages.Data.Folders || [];
    console.log("before Folder=>", this.folders);
    this.folders.splice(0, 1);
    console.log("After Folder=>", this.folders);
    if (this.folders) {
      this.selectedfolderObject = this.folders[0];
      this.storageService.setProperty('selectedfolderObject', this.selectedfolderObject);
    }
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
        this.broadcaster.broadcast('getNews');
        this.broadcaster.broadcast('getTickers');
      }
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

}
