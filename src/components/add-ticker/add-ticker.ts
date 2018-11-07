import { Platform } from 'ionic-angular/platform/platform';
import { LocalStorageProvider } from './../../providers/local-storage/local-storage';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { FormBuilder } from '@angular/forms';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { StorageService } from '../../shared/storage.service';
import { makeToast } from '../../shared/makeToast';
import { Broadcaster } from '../../shared/broadcaster';
import { Validators } from '@angular/forms';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ModalController } from 'ionic-angular';
import { FolderDropdownComponent } from '../folder-dropdown/folder-dropdown';
import { SlugSearchComponent } from '../slug-search/slug-search';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

/**
 * Generated class for the AddTickerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'add-ticker',
  templateUrl: 'add-ticker.html'
})
export class AddTickerComponent {
  @ViewChild('myInput') myInput: ElementRef;
  text: string;
  isBrowser = false;
  formData: FormGroup;
  sndTicker = [];
  UserID;
  tickers: any = [{}];
  mediaResources: any[] = [];
  folderID;
  fileURI;
  folderName;
  slugName;
  fileToUpload: File[] = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public frbl: FormBuilder,
    public httpService: HttpServiceProvider,
    public storageService: StorageService,
    public makeToast: makeToast,
    public broacaster: Broadcaster,
    public loadingCtrl: LoadingController,
    public mdlCtrl: ModalController,
    public localStorage: LocalStorageProvider,
    public platform:Platform,
    private fileChooser: FileChooser,
    private toastCtrl : ToastController,
    private transfer: FileTransfer,
    private filePath: FilePath,
  ) {
    this.checkPlatform();
    this.UserID = this.storageService.getProperty('UserCrd') || '';
    this.folderID = this.storageService.getProperty('selectedfolderObject');
    this.createForm();
    console.log('Hello AddTickerComponent Component');
    this.text = 'Hello World';
    let folders = this.localStorage.getFoldersList || [];
    if (folders) {
      if (folders.length == 2) {
        this.formData.controls['FolderId'].setValue(folders[1].Id);
        this.folderName = folders[1].Name;
      }
    }
  }
  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }
  makeLoader() {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    return loader;
  }
  checkPlatform(){
    if(this.platform.is('cordova')){
      this.isBrowser = false;
    }
    else{
      this.isBrowser = true;
    }
  }
  UploadFile(files) {
    var fileName = files;
    console.log("fileName=>", fileName);
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: fileName,
      chunkedMode: false,
      headers: {
      }
    }

    fileTransfer.upload(this.fileURI, 'https://nms.bolnetwork.com/api/generic/UploadFileAsync', options)
      .then((data: any) => {
        if (data) {

          let res = (JSON.parse(data.response)).Data[0];
          // console.log('RES=>', res);
          // this.mediaResources.push({
          //   SanPath: res.SanPath,
          //   CdnPath: res.CdnPath,
          //   Id: res.Id,
          //   MediaType: res.PackageType
          // });
          this.mediaResources.push(res);
        }
        console.log(JSON.parse(data.response), " Uploaded Successfully");
        // this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
        loader.dismiss();
        this.presentToast("Uploaded successfully");
      }, (err) => {
        console.log(err);
        loader.dismiss();
        this.presentToast("Error: Image Saved");
      });
    this.fileURI = null;
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  handleFileInput(files: FileList) {
    let loader = this.makeLoader();
    loader.present();
    this.fileToUpload = [];
    // console.log("file=>",files.item(0))
    for (let i = 0; i < files.length; i++) {
      this.fileToUpload.push(files.item(i));
    }
    console.log(this.fileToUpload);


    const formData: FormData = new FormData();
    this.fileToUpload.forEach(element => {
      formData.append('fileKey', element, element.name);
    });


    formData.append('PackageType', 'Package');
    var vdata: any = [];

    this.httpService.uploadFileWEB(this.fileToUpload, 'Package' , undefined, this.slugName  )
      .subscribe((data: any) => {
        if (data) {
          for (let i = 0; i < data.Data.length; i++) {
            this.mediaResources.push(data.Data[i]);
          }
          this.makeToast.generateToast(`File Uploaded Successfully`)
        }
        else{
          this.makeToast.generateToast(`Server Error`)
        }
        loader.dismiss();
        console.log("res=>", data);
      },(err:any)=>{
        loader.dismiss();
        this.makeToast.generateToast(`Network Error :${err.status}`)
      })

  }
  createForm() {
    this.formData = this.frbl.group({
      Text: ['', Validators],
      // FolderId: [this.folderID.Id],
      MediaResources : [[]],
      FolderId: ['', Validators.required],
      CreatedBy: [this.UserID.UserId, Validators.required],
      LoginId: [this.UserID.FullName],
      Slug: [''],
    });
  }
  get getFailedTickers() {
    let tickers = this.storageService.getProperty('failedTicker');
    return tickers || [];
  }
  set setFailedTickers(ticker) {
    this.storageService.setProperty('failedTicker', ticker);
  }
  saveFailedTicker(ticker) {
    let failedTickers = this.getFailedTickers;
    failedTickers.push(ticker);
    this.setFailedTickers = failedTickers;
  }

  resetData() {
    this.sndTicker = [];
    this.createForm()
  }
  openSlugModal() {

    let openModal = this.mdlCtrl.create(SlugSearchComponent, {
    });
    openModal.onDidDismiss(data => {
      if (data) {
        this.formData.controls['Slug'].setValue(data.Name);
        this.slugName = data.Name;
      }
      else {
        this.slugName = '';
        // this.makeToast.generateToast('Please Select Any Slug')
      }
      // console.log('dismissdata:',data)
    })
    openModal.present();
  }
  openFolderModal() {
    let folders = this.localStorage.getFoldersList || [];
    let openModal = this.mdlCtrl.create(FolderDropdownComponent, {
      folders: folders,
    });
    openModal.onDidDismiss(data => {
      if (data) {
        this.formData.controls['FolderId'].setValue(data.Id);
        this.folderName = data.Name;
      }
      else {
        this.makeToast.generateToast('Please Select Any Folder')
      }
      // console.log('dismissdata:',data)
    })
    openModal.present();
  }
  addMedia(){
    this.fileChooser.open()
    .then(uri => {
      this.filePath.resolveNativePath(uri)
        .then(filePath => {
          let filename = filePath.substring(filePath.lastIndexOf('/') + 1);
          let fileExtension = filename.substr(filename.lastIndexOf('.') + 1).replace(".", "");
          console.log(`file name: ${filename} ,  file ext : ${fileExtension}`);
          if (fileExtension == "mp4") {
            // this.videoURI.push(uri);
          }
          this.fileURI = uri;
          if (this.fileURI) {
            this.UploadFile(filename);
          }
          // console.log(filePath);
        });
      // console.log(uri);
  
    })
    .catch(e => console.log(e));
  }
  submit() {
    let loader = this.loadingCtrl.create({
      content: "Please Wait...",
    })
    loader.present();
    let sendTicker = [];
    this.formData.controls['MediaResources'].setValue(this.mediaResources);
    sendTicker.push(this.formData.value);
    this.httpService.insertTicker(sendTicker)
      .subscribe((data: any) => {
        if (data) {
          if (data.Result) {
            this.makeToast.generateToast('Ticker Submitted');
            this.resetData();
            loader.dismiss();
            this.viewCtrl.dismiss();
          }
          else {
            loader.dismiss();
            this.saveFailedTicker(this.formData.value);
            this.viewCtrl.dismiss();
            this.makeToast.generateToast('Ticker Saved:Server Error ');
          }
        }
      }, err => {
        loader.dismiss();
        this.saveFailedTicker(this.formData.value);
        this.viewCtrl.dismiss();
        this.makeToast.generateToast(`Ticker Saved: Error:${err.message}`);
      })
  }

  Dismiss() {
    this.viewCtrl.dismiss();
  }


}
