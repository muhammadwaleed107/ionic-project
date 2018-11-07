import { HttpServiceProvider } from './../../providers/http-service/http-service';
import { NavParams, ModalController, LoadingController, Content, ToastController, NavController } from 'ionic-angular';
import { Component, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { StorageService } from '../../shared/storage.service';
import { makeToast } from '../../shared/makeToast';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { SlugSearchComponent } from '../slug-search/slug-search';
import { Platform } from 'ionic-angular/platform/platform';
import { Clipboard } from '@ionic-native/clipboard';
import * as _ from 'lodash';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileTransferObject, FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer';
import { AlertController } from 'ionic-angular';
import { Broadcaster } from '../../shared/broadcaster';
/**
 * Generated class for the TickerDetailsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ticker-details',
  templateUrl: 'ticker-details.html',
  queries: {
    content: new ViewChild('content')
  }
})
export class TickerDetailsComponent {
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('content') private content: Content;
  @ViewChild('myInput') myInput: ElementRef;
  txtTicker: any = "";
  txtFileName : any = "";
  text: string;
  fileToUpload: File[] = [];
  tickerDetails = [];
  showTickerDetails = [];
  loopValue = 0;
  SlugName = "";
  slugActive: boolean;
  folderList;
  fileURI;
  folderID;
  folderName;
  isBrowser = false;
  UserID;
  mediaResources: any[] = [];
  inpSlugName;
  scrollIndex = 5;
  constructor(
    private navParam: NavParams,
    private httpService: HttpServiceProvider,
    private localService: LocalStorageProvider,
    private storageService: StorageService,
    public makeToast: makeToast,
    public viewCtrl: ViewController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    public modlCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private clipboard: Clipboard,
    public platform: Platform,
    public toastCtrl: ToastController,
    private transfer: FileTransfer,
    public alertCtrl: AlertController,
    public navCtrl : NavController,
    public broadcaster : Broadcaster
  ) {
    this.checkPlatform();
    this.folderList = this.localService.getFoldersList || [];
    // console.log(this.folderList)
    this.slugActive = this.navParam.get('slugActive');

    this.SlugName = this.navParam.get('SlugName');
    this.UserID = this.storageService.getProperty('UserCrd') || '';
    this.tickerDetails = this.navParam.get('tickerDetails');
    if (this.tickerDetails) {
      this.tickerDetails = _.sortBy(this.tickerDetails, 'CreatedOn');
      //this.loopValue = 0;
    }

     this.tickerDetails = this.tickerDetails.reverse();
    console.log('tickerdetail', this.tickerDetails)
    if (!this.slugActive) {
      this.getFolderId();
    }
    
    this.loadMoreTicker();
  }
  checkPlatform(){
    if(this.platform.is('cordova')){
      this.isBrowser = false;
    }
    else{
      this.isBrowser = true;
    }

  }
  makeLoader() {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    return loader;
  }
  handleFileInput(files: FileList) {
 
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
    console.log('FILETOUPLOADLENGTH:',this.fileToUpload.length)
    this.txtFileName = this.fileToUpload[0].name;
    // this.showPrompt(this.fileToUpload[0].name);

    // this.uploadFileMethod(this.tx);

  }
  private uploadFileMethod(fileName, sndticker?) {
    let loader = this.makeLoader();
    loader.present();
    let sndSlug = this.SlugName
    if(!this.slugActive){
    sndSlug = '';      
    }
    this.mediaResources = [];
    this.httpService.uploadFileWEB(this.fileToUpload, 'Package',fileName, sndSlug)
      .subscribe((data: any) => {
        if (data) {
          for (let i = 0; i < data.Data.length; i++) {
            this.mediaResources.push(data.Data[i]);
          }
          //this.makeToast.generateToast(`File Uploaded Successfully`);
          this.fileToUpload = [];
          let sndblankTicker = [];

          Object.assign(sndticker[0],{
            MediaResources: this.mediaResources,
          });
          this.insertTickerHit(sndticker);
          // this.submitTickerOnCondition();
        }
        else {
          this.makeToast.generateToast(`Server Error`);
        }
        loader.dismiss();
        console.log("res=>", data);
      }, (err: any) => {
        loader.dismiss();
        this.makeToast.generateToast(`Network Error :${err.status}`);
      });
  }

  resize() {
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }
  scrollToBottm() {
    setTimeout(() => {
      var elem = document.getElementsByClassName("unReadStart")[0];
      if (elem)
        elem.scrollIntoView();
      else
        this.content.scrollToBottom();

    }, 300);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonalChatPage');

    this.scrollToBottm();
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
          this.fileToUpload = [];
          let sndblankTicker = [];
          this.presentToast("Uploaded successfully");
          this.submitTickerOnCondition();
  
        }
        console.log(JSON.parse(data.response), " Uploaded Successfully");
        // this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
        loader.dismiss();
    
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
  popPage(){

    this.broadcaster.broadcast('mediaChanges','All');
    this.navCtrl.pop();
  }
  copyTicker(text) {
    if (this.platform.is('cordova')) {
      this.clipboard.copy(text);
      this.makeToast.generateToast('Copied');
      return
    }
    let selBox = document.createElement('textarea');
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.makeToast.generateToast('Copied');
  }
  getFolderName(FolderId) {
    let foldername = this.localService.getfolderNameByID(FolderId);
    return foldername
  }
  ionViewDidEnter() {
    // let that = this;
    // setTimeout(()=>{that.content.scrollToBottom();},200); 

  }
  showPrompt(fileName?) {
    const prompt = this.alertCtrl.create({
      title: 'File Name',
      message: "Enter a File name",
      inputs: [
        {
          name: 'title',
          value:fileName
          // placeholder: fileName
        },
      ],
      buttons: [
        {
          text: 'Upload',
          handler: data => {
            this.uploadFileMethod(data.title);
            console.log(data);
            // console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }
  submitTickerOnCondition() {
    let sndTicker = [];
    console.log(this.folderName);
    if (this.slugActive) {

      var publicfolders = this.folderList.filter(item => { return item.Name != "MyFolder" });

      if (publicfolders && publicfolders.length == 1) {
        sndTicker.push({
          CreatedBy: this.UserID.UserId,
          LoginId: this.UserID.FullName,
          Text: this.txtTicker,
          Slug: this.SlugName,
          FolderId: publicfolders[0].Id,
          MediaResources: this.mediaResources,
          CreatedOn: new Date().toISOString(),
          MyTicker: 'MyTicker'
        });
        this.insertTickerHit(sndTicker);
      }
      else
      {
        let openModal = this.modlCtrl.create(SlugSearchComponent, {
          folderList: this.folderList
        });
        openModal.present();
        openModal.onDidDismiss(data => {
          // console.log('data=>',data)
          if (data) {

            sndTicker.push({
              CreatedBy: this.UserID.UserId,
              LoginId: this.UserID.FullName,
              Text: this.txtTicker,
              Slug: this.SlugName,
              FolderId: data.Id,
              MediaResources: this.mediaResources,
              CreatedOn: new Date().toISOString(),
              MyTicker: 'MyTicker'
            });
            this.uploadFileMethod(this.txtFileName, sndTicker);
            // var res = this.insertTickerHit(sndTicker);


            // Object.assign(sndTicker[0],{
            //   
            // })
            //this.tickerDetails.push(sndTicker[0]);
            console.log('afterPush', this.tickerDetails)

            this.scrollToBottm();
          }
          else {
            this.makeToast.generateToast('Please Select Folder');
          }
        });
      }



    }

    else {
      let openModal = this.modlCtrl.create(SlugSearchComponent);
      openModal.present();
      openModal.onDidDismiss(data => {
        sndTicker.push({
          CreatedBy: this.UserID.UserId,
          LoginId: this.UserID.FullName,
          Text: this.txtTicker,
          Slug: data.Name,
          MediaResources: this.mediaResources,
          MyTicker: 'MyTicker',
          FolderId: this.folderID,
        });
        this.scrollToBottm();
        this.insertTickerHit(sndTicker);

      });
    }
  }
  addTicker() {
    if (this.fileToUpload.length > 0) {
      if(this.isBrowser){
      // this.uploadFileMethod(this.txtFileName);
    this.submitTickerOnCondition();
      }
      else{
        this.UploadFile(this.txtFileName);
      }
      return
    }
    else
    {

      this.submitTickerOnCondition();
    }
    if ((this.txtTicker == "" || !this.txtTicker) && this.mediaResources.length == 0) {
      this.makeToast.generateToast('Please Enter Ticker');
      return
    }
  }
  private insertTickerHit(sndTicker: any[]) {
    let loader = this.loadingCtrl.create({
      content: "Please Wait...",
    })
    this.txtTicker = "";
    // loader.present();
    this.httpService.insertTicker(sndTicker)
      .subscribe((data: any) => {
        if (data.Result) {
          this.tickerDetails.push(data.Data[0]);
          this.showTickerDetails.push(data.Data[0]);
          this.scrollToBottm();
          // loader.dismiss();
          this.mediaResources = [];
          this.makeToast.generateToast('Ticker Submitted');
        }
        else {
          // loader.dismiss();
          this.makeToast.generateToast('Ticker failed Server Error');
        }
      }, (err => {
        // loader.dismiss();
        this.makeToast.generateToast('Ticker failed Network Error');
      }));
  }
addMedia(){
  this.fileToUpload = [];
  this.fileChooser.open()
  .then(uri => {
    this.filePath.resolveNativePath(uri)
      .then(filePath => {
        let filename = filePath.substring(filePath.lastIndexOf('/') + 1);
        this.txtFileName = filename;
        let fileExtension = filename.substr(filename.lastIndexOf('.') + 1).replace(".", "");
        console.log(`file name: ${filename} ,  file ext : ${fileExtension}`);
        if (fileExtension == "mp4") {
          // this.videoURI.push(uri);
        }
        this.fileURI = uri;
        if (this.fileURI) {
          this.fileToUpload.push(name);
          this.txtFileName = filename;
          // this.UploadFile(filename);
        }
        // console.log(filePath);
      });
    // console.log(uri);

  })
  .catch(e => console.log(e));
}

  loadMoreTicker() {

    if (this.loopValue < this.tickerDetails.length)
    {
      let tempArr = [];
      for (let i = this.loopValue; i < this.loopValue + 5; i++) {
        if (this.tickerDetails[i])
          tempArr.push(this.tickerDetails[i]);
          //this.showTickerDetails.push(this.tickerDetails[i]);

      }

      tempArr = tempArr.reverse();
      if (this.showTickerDetails.length == 0) {
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i])
            this.showTickerDetails.push(tempArr[i]);

        }
      }
      else
      {
        tempArr = _.sortBy(tempArr, 'CreatedOn');
        tempArr = tempArr.reverse();

        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i])
            this.showTickerDetails.unshift(tempArr[i]);

        }
      }

      this.loopValue = this.showTickerDetails.length;
    }

  }

  getagoTime(datetime: string) {
    // let date =  (new Date(datetime)).toISOString();
    // console.log(date)
    return moment(datetime).fromNow();

  }
  getDate(datetime: string) {
    var date = new Date(datetime)
    return moment(date).format('LL');
  }
  getTime(datetime: string) {
    var date = new Date(datetime)
    return moment(date).format('LT');
  }
  closeModal() {
    this.viewCtrl.dismiss();
  }
  getFolderId() {
    if (this.folderList.length) {
      this.folderList.forEach(element => {
        if (element.Name == this.SlugName) {
          this.folderID = element.Id;
          console.log('folderID', this.folderID)
        }
      });
    }
  }

}
