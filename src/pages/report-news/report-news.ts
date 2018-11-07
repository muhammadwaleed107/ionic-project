import { NewsCommentsComponent } from './../../components/news-comments/news-comments';
import { PictureWebComponent } from './../../components/picture-web/picture-web';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup } from '@angular/forms/src/model';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { LocationSearchComponent } from '../../components/location-search/location-search';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { CategourySearchComponent } from '../../components/categoury-search/categoury-search';
import { FileChooser } from '@ionic-native/file-chooser';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { StorageService } from '../../shared/storage.service';
import { makeToast } from '../../shared/makeToast';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { Platform } from 'ionic-angular/platform/platform';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { LoginPage } from './../login/login';
import { HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import { FilePath } from '@ionic-native/file-path';
import { VideoPlayer } from '@ionic-native/video-player';
/**
 * Generated class for the ReportNewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-report-news',
  templateUrl: 'report-news.html',
})
export class ReportNewsPage {
  createStory: FormGroup;
  locations = [];
  insertSubmit = [];
  locationName;
  categouryName;
  categories = [];
  fileURI;
  UserID: any;
  mediaResources: any[] = [];
  FolderId: any;
  enews;
  isEdit = false;
  imageFaileURI = [];
  isBrowser;
  selectedLocation: any;
  option: ImagePickerOptions;
  fileToUpload: File[] = [];
  packageType;
  filterPackageType = 'All';
  All = true;
  videoURI = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public frbl: FormBuilder,
    public modalCtrl: ModalController,
    public httpService: HttpServiceProvider,
    private fileChooser: FileChooser,
    private loadingCtrl: LoadingController,
    private transfer: FileTransfer,
    private toastCtrl: ToastController,
    private storageService: StorageService,
    private makeToast: makeToast,
    private photoViewer: PhotoViewer,
    private imagePicker: ImagePicker,
    private base64: Base64,
    private viewCtrl: ViewController,
    public platform: Platform,
    public localStorage: LocalStorageProvider,
    private filePath: FilePath,
    private videoPlayer: VideoPlayer

  ) {
    this.UserID = this.storageService.getProperty('UserCrd') || '';
    this.FolderId = this.storageService.getProperty('selectedfolderObject') || '';

    this.createForm();
    this.packageType = this.getPackageType;
    // this.mediaResources.push({ SanPath: "http://nmsdatacom.bolnetwork.com/assets/mobileuploads/Desert.jpg", CdnPath: null, Id: "5b6c2114825ed00220595c72" });

  }
  setSelectLocation() {

    this.selectedLocation = this.localStorage.getACLList;
    if (this.selectedLocation) {
      this.selectedLocation = this.selectedLocation.Data.MarkedLocation;
      this.Getlocation(this.selectedLocation);
      this.createStory.controls['LocationId'].setValue(this.selectedLocation.Id);
    }
    console.log('selectedlocation', this.selectedLocation);
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

    var Type = this.createStory.controls['selectPackageValue'].value;
    formData.append('PackageType', Type);
    var vdata: any = [];
    // $.ajax({
    //   url: 'https://nms.bolnetwork.com/api/generic/UploadFileAsync',
    //   type: 'POST',
    //   data: formData,
    //   async: false,
    //   cache: false,
    //   contentType: false,
    //   processData: false,
    //   success: function (data: any) {
    //     if (data) {
    //       vdata = data;
    //     }
    //   },
    //   error: function (request, status, error) {
    //     vdata = null;
    //   }

    // });
    // if (vdata) {
    //   for (let i = 0; i < vdata.Data.length; i++) {

    //     this.mediaResources.push(vdata.Data[i]);
    //   }
    // }

    this.httpService.uploadFileWEB(this.fileToUpload, this.createStory.controls['selectPackageValue'].value)
      .subscribe((data: any) => {
        if (data) {
          for (let i = 0; i < data.Data.length; i++) {
            this.mediaResources.push(data.Data[i]);
          }
       
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

  setForm() {
    this.createEditForm();
    this.createStory.controls['id'].setValue(this.enews.Id);
    this.createStory.controls['Title'].setValue(this.enews.Title);
    this.createStory.controls['Slug'].setValue(this.enews.Slug);
    this.createStory.controls['HighLight'].setValue(this.enews.HighLight);
    this.createStory.controls['VoiceOver'].setValue(this.enews.VoiceOver);
    this.createStory.controls['LocationId'].setValue(this.enews.LocationId);
    this.createStory.controls['CategoryId'].setValue(this.enews.CategoryId);
    this.createStory.controls['FolderId'].setValue(this.enews.FolderId);
    this.createStory.controls['UpdatedBy'].setValue(this.UserID.UserId);
    this.createStory.controls['selectPackageValue'].setValue('Package');
    this.filterPackageType = 'Package'

    var objInd = this.packageType.findIndex(x => x.PackageTypeName == 'Package');

    if (objInd != -1) {
      this.packageType[objInd].selected = true;
    }

    console.log("enews: " + this.enews);
    if (this.enews.MediaResources) {
      this.enews.MediaResources.forEach(element => {
        console.log("element : " + element);
        this.mediaResources.push(element);
      });
    }
    this.Getlocation({ Id: this.enews.LocationId });
    if (this.categories) {
      // console.log('cate',this.categories);
      this.categories.forEach(element => {
        if (element.Id == this.enews.CategoryId) {
          this.categouryName = element.Category
        }
      });
    }
    console.log('MEDIA', this.mediaResources)


  }
  private Getlocation(locationid) {
    if (this.locations) {
      this.locations.forEach(element => {
        if (element.Id == locationid.Id) {
          this.locationName = element.Location;
          return;
        }
      });
    }
  }

  createEditForm() {
    this.createStory = this.frbl.group({
      id: [''],
      Title: ['', Validators.required],
      Slug: [''],
      VoiceOver: [''],
      HighLight: [''],
      LoginId: [this.UserID.FullName],
      Description: [''],
      MediaResources: [[{ SanPath: "", CdnPath: "", Id: "", MediaType: 0 }]],
      LocationId: ['', Validators.required],
      CategoryId: [''],
      CategoryName: [''],
      UpdatedBy: [''],
      FolderId: [this.FolderId.Id],
      selectPackageValue: [''],
      CreatedBy: [this.UserID.UserId, Validators.required]
    });
  }
  createForm() {
    this.createStory = this.frbl.group({
      Title: ['', Validators.required],
      Slug: [''],
      Description: [''],
      VoiceOver: [''],
      HighLight: [''],
      LoginId: [this.UserID.FullName],
      MediaResources: [[{ SanPath: "", CdnPath: "", Id: "", MediaType: 0 }]],
      LocationId: ['', Validators.required],
      CategoryId: ['', Validators.required],
      CategoryName: [''],
      FolderId: [this.FolderId.Id],
      selectPackageValue: [''],
      CreatedBy: [this.UserID.UserId, Validators.required]
    });
    let myfolderid = this.navParams.get('myfolderid');
    if (myfolderid) {
      this.createStory.controls['FolderId'].setValue(myfolderid);
    }
  }

  selectFile() {
    console.log(this.createStory.controls['selectPackageValue'].value)
    if (this.createStory.controls['selectPackageValue'].value == "" || this.createStory.controls['selectPackageValue'].value == "All") {
      this.makeToast.generateToast('Please Select any Type')
      return
    }
    this.fileChooser.open()
      .then(uri => {
        this.filePath.resolveNativePath(uri)
          .then(filePath => {
            let filename = filePath.substring(filePath.lastIndexOf('/') + 1);
            let fileExtension = filename.substr(filename.lastIndexOf('.') + 1).replace(".", "");
            console.log(`file name: ${filename} ,  file ext : ${fileExtension}`);
            if (fileExtension == "mp4") {
              this.videoURI.push(uri);
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
  addImages() {
    if (this.createStory.controls['selectPackageValue'].value == "" || this.createStory.controls['selectPackageValue'].value == "All") {
      this.makeToast.generateToast('Please Select any Type')
      return
    }
    if (this.platform.is('core') || this.platform.is('windows')) {
      this.makeToast.generateToast('Not Supported');
      return
    }
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'raza.jpg',
      headers: {}
    }
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.imagePicker.getPictures(this.option).then((results) => {
      console.log('Image URI: ' + results);
      for (var i = 0; i < results.length; i++) {
        // image.src = results[i];
        let filePath: string = results[i];
        // console.log("imageSRC=>", image);
        var fileName = results[i].substr(results[i].lastIndexOf('/') + 1);
        // console.log("fileName=>", fileName);
        var fileExtension = results[i].substr(results[i].lastIndexOf('/') + 1);
        options = {
          fileKey: 'file',
          fileName: fileName,
          headers: {
            PackageType: this.createStory.controls['selectPackageValue'].value
          }
        }
        // options.fileName = results[i];
        // console.log('Image URI: ' + results[i]);
        // loader.present();v

        const fileTransfer: FileTransferObject = this.transfer.create();

        // console.log('FILETRANSFER=>', fileTransfer);
        fileTransfer.upload(results[i], 'https://nms.bolnetwork.com/api/generic/UploadFileAsync', options)
          .then((data: any) => {
            if (data) {
              let res = (JSON.parse(data.response)).Data[0];
              console.log('RES=>', res);
              // this.mediaResources.push({
              //   SanPath: res.SanPath,
              //   CdnPath: res.CdnPath,
              //   Id: res.Id
              // });
              this.mediaResources.push(res);
            }
            console.log(JSON.parse(data.response), " Uploaded Successfully");
            // this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
            // loader.dismiss();
            this.presentToast("Uploaded successfully");
          }, (err: any) => {
            this.imageFaileURI.push(err.source);
            console.log("ImageFiledURI=>", this.imageFaileURI);
            console.log(err);
            // loader.dismiss();
            this.presentToast(err);
          });
      }
    }, (err) => { });
  }

  deleteImg(index) {
    this.mediaResources.splice(index, 1);
  }

  saveFailedNews(news) {
    // let failedNews = news;
    // Object.assign(failedNews, {
    //   failedURI: this.imageFaileURI,
    // });
    // let localFailedNews = this.storageService.getProperty('failedNews') || [];
    // localFailedNews.push(failedNews);
    // this.storageService.setProperty('failedNews', localFailedNews);
  }
  makeLoader() {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    return loader;
  }
  submit() {
    let loader = this.loadingCtrl.create({
      content: "Please Wait..."
    });
    loader.present();
    this.createStory.controls['MediaResources'].setValue(this.mediaResources);
    this.createStory.controls['CategoryName'].setValue(this.categouryName);
    console.log('data=>', this.createStory.value);
    if (this.isEdit) {
      this.httpService.updateNews(this.createStory.value)
        .subscribe((res: any) => {
          loader.dismiss();
          if (res) {
            if (res.Result) {
              this.makeToast.generateToast('News Updated');
              this.viewCtrl.dismiss();
            }
            else {
              this.makeToast.generateToast('Failed');
            }
          }
          console.log('updateNews=>', res);
        }, err => {
          loader.dismiss();
        });
      return
    }

    this.createStory.controls['CreatedBy'].setValue(this.UserID.UserId);
    if (this.imageFaileURI.length > 0) {
      this.saveFailedNews(this.createStory.value)
      this.makeToast.generateToast('Pending Image: News Saved');
      return
    }
    this.insertSubmit.push(this.createStory.value)
    this.httpService.insertNews(this.insertSubmit)
      .subscribe((data: any) => {
        if (data) {
          if (data.Data) {
            this.clearData()
            loader.dismiss();
            this.makeToast.generateToast('News Inserted');

            this.viewCtrl.dismiss({ result: data.Data });
          }
          else {
            this.saveFailedNews(this.createStory.value);
            loader.dismiss();
            this.viewCtrl.dismiss();

            this.makeToast.generateToast('Server Error: News Saved');
          }
        }
      }, err => {
        loader.dismiss();
        this.saveFailedNews(this.createStory.value);
        this.viewCtrl.dismiss();
        this.makeToast.generateToast('Error: News Saved');
      })
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
        PackageType: this.createStory.controls['selectPackageValue'].value
      }
    }

    fileTransfer.upload(this.fileURI, 'https://nms.bolnetwork.com/api/generic/UploadFileAsync', options)
      .then((data: any) => {
        if (data) {

          let res = (JSON.parse(data.response)).Data[0];
          console.log('RES=>', res);
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
  openImg(SanPath) {
    
    if (this.platform.is('cordova')) {
      this.photoViewer.show(SanPath, 'Image', { share: true });
    }
    else{
     let modal = this.modalCtrl.create(
        PictureWebComponent,
      {imgURL:SanPath
      });
      modal.present();
    }
  }
  openVideoModal(videoURL){
    let modal = this.modalCtrl.create(
      PictureWebComponent,
    {videoURL:videoURL
    });
    modal.present();
    console.log('thisis Video',videoURL)
  }
  openVideo(SanPath) {

    this.videoPlayer.play(SanPath).then(() => {
      console.log('video completed');
    }).catch(err => {
      console.log(err);
    });
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  Dismiss() {
    this.viewCtrl.dismiss();
  }
  locationModal() {

    let OpenModal = this.modalCtrl.create(LocationSearchComponent, {
      locations: this.locations
    });
    OpenModal.onDidDismiss(data => {
      // console.log(data);
      if (data) {
        this.createStory.controls['LocationId'].setValue(data.Id);
        this.locationName = data.Location;
      }
    });
    OpenModal.present();
  }
  categouryModal() {
    let OpenModal = this.modalCtrl.create(CategourySearchComponent, {
      categories: this.categories
    });
    OpenModal.onDidDismiss(data => {
      console.log(data);
      if (data) {
        this.createStory.controls['CategoryId'].setValue(data.Id);
        this.categouryName = data.Category;
      }
    });
    OpenModal.present();
  }
  clearData() {
    this.locationName = "";
    this.categouryName = "";
    this.mediaResources = [];
    // this.createStory.reset();
    this.createForm();
    // this.createStory.
  }
  selectPackageType(item, index) {

    for (var i = 0; i < this.packageType.length; i++) {
      this.packageType[i].selected = false;
    }

    if (index != undefined) {
      this.packageType[index].selected = true;
      console.log(this.packageType[index]);

    }

    this.filterPackageType = item.PackageTypeName;
    this.createStory.controls['selectPackageValue'].setValue(item.PackageTypeName);
  }
  get getLocations() {
    return this.storageService.getProperty('locations');
  }
  get getCategories() {
    return this.storageService.getProperty('categories');
  }
  get getPackageType() {
    let packagetype = this.localStorage.getACLList;

    if (packagetype) {
      packagetype = packagetype.Data.PackageTypeList;

      for (var i = 0; i < packagetype.length; i++) {
        packagetype[i].selected = false;
        //  console.log(packagetype[i]);
        //  console.log("getpackagetype function called : "+ this.packageType[i]);
      }

    }

    return packagetype || null;
  }
  ionViewDidLoad() {

    // this.httpService.getGeneric()
    //   .subscribe((data: any) => {
    //     console.log(data);
    //     if (data) {
    //       this.locations = data.Data.Locations;
    //       this.categories = data.Data.Categories;
    //     }
    //     this.enews = this.navParams.get('newsObject');
    //     if (this.enews) {
    //       this.isEdit = true;
    //       this.setForm();
    //       console.log("enews=>", this.enews);
    //     }
    //   })
    if (this.platform.is('cordova')) {
      this.isBrowser = false;
    }
    else {
      this.isBrowser = true;
    }
    console.log("isbrowserValue=>", this.isBrowser)
    this.locations = this.getLocations
    this.categories = this.getCategories;

    this.enews = this.navParams.get('newsObject');
    if (this.enews) {
      this.isEdit = true;

      this.setForm();
      console.log("enews=>", this.enews);
    }
    else {
      this.setSelectLocation();
    }
  }

  getBg(url) {
    return 'url(' + url + ')';
  }
}
