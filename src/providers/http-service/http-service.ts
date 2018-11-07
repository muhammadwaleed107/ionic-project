import { LocalStorageProvider } from './../local-storage/local-storage';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { API_HOST } from './../../app/api.module';
import { StorageService } from '../../shared/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { Broadcaster } from '../../shared/broadcaster';
import { Base64 } from '@ionic-native/base64';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Dictionary } from '../../shared/dictionary';
import { Globals } from '../../shared/global';
/*
  Generated class for the HttpServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpServiceProvider {

  constructor(
    public http: HttpClient,
    @Inject(API_HOST) private _APIHOST: any,
    private storageService: StorageService,
    private broadcast: Broadcaster,
    private base64: Base64,
    private localService: LocalStorageProvider,
    public globals: Globals
  ) {
    console.log('Hello HttpServiceProvider Provider');
  }
  get getHeader(): HttpHeaders {
    let data = ''
    data.toString();
    let deviceToken = this.storageService.getProperty('deviceToken') || '';
    let userID = ((this.localService.getUserId)) || '';
    let userName = (this.localService.getUsername) || '';

    let headers = new HttpHeaders().set('DeviceToken', deviceToken.toString()).set('UserId', userID.toString()).set('UserName', userName.toString());
    return headers;
  }
  logoutapi(obj) {
    return this.http.post(`${this._APIHOST}api/generic/LogoutUser`, obj)
  }
  loginapi(crd) {
    return this.http.post(`${this._APIHOST}api/login`, crd)
  }
  getControl(crd) {
    return this.http.post(`${this._APIHOST}api/generic/GetUserAccessRight`, crd)
  }
  getGeneric() {
    return this.http.get(`${this._APIHOST}api/generic/GetAllStaticData`);
  }
  UpdateAssignToNLEStatus(ResourceId) {
    return this.http.get(`${this._APIHOST}api/resource/UpdateAssignToNLEStatus?ResourceId=${ResourceId}`, { headers: this.getHeader });
  }

  uploadNleFile(formData: FormData) {

    return this.http
      .post(`${this._APIHOST}api/generic/UploadFileAsync`, formData, { headers: this.getHeader });
  }
  uploadFileWEB(fileToUpload: File[] = [], fileType, fileName?, beat?) {
    const formData: FormData = new FormData();
    if (fileName) {
      fileToUpload.forEach(element => {
        formData.append('fileKey', element, element.name);
        formData.append('fileName', fileName);

      });
    }
    else {
      fileToUpload.forEach(element => {
        formData.append('fileKey', element, element.name);
        formData.append('fileName', element.name);
      });
    }
    formData.append('Beat', beat);

    let header = new HttpHeaders().set('PackageType', fileType)
    // formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http
      .post(`${this._APIHOST}api/generic/UploadFileAsync`, formData, { headers: header })

  }
  sendtoNLE(resourceId,comments) {
    let headers = new HttpHeaders().set('UserId',(this.localService.getUserId).toString()).set('UserName',this.localService.getUsername);
    return this.http.get(`${this._APIHOST}api/resource/AssignToNLE?ResourceId=${resourceId}&Comments=${comments }`, {headers: headers});

  }
  getGridTicker() {
    return this.http.post(`${this._APIHOST}api/ticker/GetGridTickerData`, {});
  }
  insertNews(newsData) {
    return this.http.post(`${this._APIHOST}api/News/InsertNews`, newsData, { headers: this.getHeader });
  }
  insertTicker(newsData) {
    return this.http.post(`${this._APIHOST}api/ticker/InsertTicker`, newsData, { headers: this.getHeader });
  }
  getTicker() {
    return this.http.get(`${this._APIHOST}api/Ticker`, { headers: this.getHeader });
  }
  getAllNewsbyFolderID(folderID, UserId) {
    return this.http.get(`${this._APIHOST}api/news/GetAllNewsByFolderId?FolderId=${folderID}&CreatedBy=${UserId}`, { headers: this.getHeader });
  }
  getTickerbyFolderID(folderID) {
    return this.http.get(`${this._APIHOST}api/ticker/GetAllTickerByFolderId?FolderId=${folderID}`, { headers: this.getHeader });
  }
  updateNews(newsObject) {
    return this.http.post(`${this._APIHOST}api/news/UpdateNews`, newsObject, { headers: this.getHeader });
  }
  deleteTicker(tickerObject) {
    return this.http.post(`${this._APIHOST}api/ticker/UpdateTicker`, tickerObject, { headers: this.getHeader });
  }
  copyToNewsFolder(moveObject) {
    return this.http.post(`${this._APIHOST}api/news/CopyNewsToFolder`, moveObject, { headers: this.getHeader });
  }
  deleteNews(newsObject) {
    return this.http.post(`${this._APIHOST}api/news/UpdateNews`, newsObject, { headers: this.getHeader });
  }
  newsPolling(folderID, LastTickerSyncTime) {
    return this.http.get(`${this._APIHOST}api/news/NewsPolling?FolderId=${folderID}&LastTickerSyncTime=${LastTickerSyncTime}`);
  }
  get getFolders() {
    let foldersList = this.storageService.getProperty('ACLRights');
    return foldersList.Data.Folders;
  }
  tickerPolling(folderID, LastTickerSyncTime) {
    return this.http.get(`${this._APIHOST}api/news/TickerPolling?FolderId=${folderID}&LastTickerSyncTime=${LastTickerSyncTime}`);
  }
  getDownloadMedia(ResourceId) {
    return this.http.get(`${this._APIHOST}api/resource/DownloadResource?ResourceId=${ResourceId}`);
  }

  mediaPolling() {
    let LastMediaSyncTime = this.getLastMediaTime || null;
    let userID = this.storageService.getProperty('UserCrd');
    let httpHeader = new HttpHeaders()
    if (LastMediaSyncTime != null) {
      httpHeader = httpHeader.set('LastResourceSyncTime', LastMediaSyncTime).set('UserId', userID.UserId.toString());
    }
    else {
      httpHeader = httpHeader.set('LastResourceSyncTime', '').set('UserId', userID.UserId.toString());
    }
    // return this.http.post(`${this._APIHOST}api/news/GetAllNews`, this.getFolders, { headers: httpHeader })

    return this.http.post(`${this._APIHOST}api/generic/GetAllMediaResource`, '', { headers: httpHeader });
  }


  delete48hoursOldNews() {


    setTimeout(() => {
      var storedNews = this.storageService.getProperty('storedNews') || [];
      console.log("delete48HoursOldNews");
      let todaysDate = moment();
      let createdDate;
      let duration;
      if (storedNews) {
        for (var i = 0; i < storedNews.length; i++) {
          createdDate = moment(storedNews[i].CreatedOn);
          var test = storedNews[i];
          duration = moment.duration(todaysDate.diff(createdDate));
          duration = Math.floor(duration.asHours());
          if (duration >= 48) {
            storedNews.splice(i, 1);
            i = i - 1;
          }
        }
        this.storageService.setProperty('storedNews', storedNews);
        this.broadcast.broadcast('newNews');
      }
      this.NewsDeletionPolling();
    }, 10000);

  }

  NewsDeletionPolling() {
    setTimeout(() => {
      this.delete48hoursOldNews();
    }, 100);

  }

  delete48hoursOldTicker() {

    setTimeout(() => {
      var storedTicker = this.storageService.getProperty('storedTicker') || [];
      console.log("delete48HoursOldTicker");
      let todaysDate = moment();
      let createdDate;
      let duration;
      if (storedTicker) {
        for (var i = 0; i < storedTicker.length; i++) {
          createdDate = moment(storedTicker[i].CreatedOn);
          var test = storedTicker[i];
          duration = moment.duration(todaysDate.diff(createdDate));
          duration = Math.floor(duration.asHours());
          if (duration >= 48) {
            storedTicker.splice(i, 1);
            i = i - 1;
          }
        }
        this.storageService.setProperty('storedTicker', storedTicker);
        this.broadcast.broadcast('newTicker');
      }
      this.TickerDeletionPolling();
    }, 10000);

  }

  TickerDeletionPolling() {
    setTimeout(() => {
      this.delete48hoursOldTicker();
    }, 100);

  }



  getNewsByPolling() {
    let LastNewsSyncTime = this.getLastNewsTime || null;
    let userID = this.storageService.getProperty('UserCrd');
    let httpHeader = new HttpHeaders()
    if (LastNewsSyncTime != null) {
      httpHeader = httpHeader.set('LastNewsSyncTime', LastNewsSyncTime).set('UserId', userID.UserId.toString());
    }
    else {
      httpHeader = httpHeader.set('UserId', userID.UserId.toString());
    }
    return this.http.post(`${this._APIHOST}api/news/GetAllNews`, this.getFolders, { headers: httpHeader })

  }
  getTickerByPolling() {
    let LastTickerSyncTime = this.getLastTickerTime || null;
    let userID = this.storageService.getProperty('UserCrd');
    let httpHeader = new HttpHeaders()
    if (LastTickerSyncTime != null) {
      httpHeader = httpHeader.set('LastTickerSyncTime', LastTickerSyncTime).set('UserId', userID.UserId.toString());
    }
    else {
      httpHeader = httpHeader.set('UserId', userID.UserId.toString());
    }
    return this.http.post(`${this._APIHOST}api/ticker/GetAllTicker`, this.getFolders, { headers: httpHeader })
  }

  private spliceDeleteItem(storedTicker: any, item: any) {
    for (let j = 0; j < storedTicker.length; j++) {
      if (storedTicker[j].Id == item.Id) {
        storedTicker.splice(j, 1);
        j = 0;
      }
    }
    return storedTicker;
  }

  addNewMedia(data) {

    let storedMedia = this.localService.getStoredMediaList;
    let media = [];
    let nle = [];
    if (data) {
      let resources = data.Data.resources
      for (let i = 0; i < resources.length; i++) {
        let index = storedMedia.findIndex(x => x.Id == resources[i].Id)
        if (index != -1) {
          storedMedia[index] = resources[i];
          nle.push(resources[i]);
        //  resources.splice(i, 1)
        }
        else{
          storedMedia.push(resources[i]);
        }
      }
      if (resources) {
        for (let i = 0; i < resources.length; i++) {
          // storedMedia.push(resources[i]);
          media.push(resources[i]);
        }
      }
    }
    let newSyncTime = data.Data.LastResourceSyncTime;
    this.localService.setMediaSyncTime = newSyncTime;
    this.localService.setStoredMediaList = storedMedia;
    this.broadcast.broadcast('mediaChanges', media);
    this.broadcast.broadcast('nleChanges', nle);
  }
  addNewTickers(data) {
    let storedTicker = this.storageService.getProperty('storedTicker') || [];
    let temp = [];
    temp = data.Data.Tickers || [];
    if (storedTicker) {
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].IsDeleted) {
          storedTicker = this.spliceDeleteItem(storedTicker, temp[i]);
          temp.splice(i, 1);
          i = i - 1;
        }
        else {
          for (let j = 0; j < storedTicker.length; j++) {
            if (temp.length > 0) {
              if (temp[i].IsDeleted) {
                storedTicker = this.spliceDeleteItem(storedTicker, temp[i]);
                temp.splice(i, 1);
                i = i - 1;
              }
              else {
                if (storedTicker[j].Id == temp[i].Id) {
                  storedTicker[j] = temp[i];
                  temp.splice(i, 1);
                }
              }
            }
          }
        }
        // storedNews.forEach(element => {
        // });
      }

    }
    temp.forEach(element => {
      // element.isRead = false;
      storedTicker.push(element);
    });
    this.storeInSlugWise(temp);
    this.storeInFolderWise(temp);
    this.storageService.setProperty('storedTicker', storedTicker);
    // let storedTicker = this.storageService.getProperty('storedTicker') || [];
    // data.Data.Tickers.forEach(element => {
    //   storedTicker.push(element);
    // });
    // this.storageService.setProperty('storedTicker', storedTicker);
    // // this.tickers = this.localTicker;


    let LastTickerSyncTime = data.Data.LastTickerSyncTime;
    this.storageService.setProperty('LastTickerSyncTime', LastTickerSyncTime);

    // this.broadcast.broadcast('newTicker');
  }
  storeInFolderWise(ticker) {
    if (ticker) {
      ticker.forEach(element => {
        element.FolderName = this.localService.getfolderNameByID(element.FolderId)
      });
    }
    let FolderWise: any = [];

    FolderWise = this.localService.getFolderWise || [];
    if (FolderWise.length > 0) {
      for (let i = 0; i < FolderWise.length; i++) {
        for (let j = 0; j < ticker.length; j++) {
          if (FolderWise[i].Key == ticker[j].FolderName) {
            Object.assign(ticker[j], { isRead: false })
            FolderWise[i].Value.push(ticker[j])
          }
        }
      }
    }
    else {
      var uniqSlugs = _.uniqBy(ticker, 'FolderName');
      var tempSlugWise = _.groupBy(ticker, 'FolderName');
      for (let j = 0; j < uniqSlugs.length; j++) {
        var key = uniqSlugs[j].FolderName;
        if (this.localService.getFirstLogin == 0) {
          Object.assign(tempSlugWise[key][j], { isRead: false });
        }
        FolderWise.push({
          Key: key,
          Value: tempSlugWise[key],
        })
      }

      // for (let i = 0; i < FolderWise.length; i++) {
      //   FolderWise[i].Value.forEach(element => {
      //     element.isRead = false;
      //   });
      // }

    }
    this.localService.setFolderWise = FolderWise;
    this.localService.setFirstLogin = 0;
    this.broadcast.broadcast('newTicker');
  }

  storeInSlugWise(ticker) {

    let SlugWise: any = [];
    let slugFound = false;
    SlugWise = this.localService.getSlugWise || [];
    for (let i = 0; i < SlugWise.length; i++) {
      for (let j = 0; j < ticker.length; j++) {
        if (SlugWise[i].Key == ticker[j].Slug) {
          slugFound = true;
          Object.assign(ticker[j], { isRead: false })
          SlugWise[i].Value.push(ticker[j]);
        }
      }
    }
    if (!slugFound) {
      var uniqSlugs = _.uniqBy(ticker, 'Slug');
      var tempSlugWise = _.groupBy(ticker, 'Slug');
      for (let j = 0; j < uniqSlugs.length; j++) {
        var key = uniqSlugs[j].Slug;
        if (this.localService.getFirstLogin == 0) {
          Object.assign(tempSlugWise[key][j], { isRead: false });
        }
        SlugWise.push({
          Key: key,
          Value: tempSlugWise[key],
        })
      }
      // if (this.localService.getFirstLogin == 0) {
      //   for (let i = 0; i < SlugWise.length; i++) {
      //     SlugWise[i].Value.forEach(element => {
      //       element.isRead = false;
      //     });
      //   }
      // }
      // ticker.forEach(element => {
      //   SlugWise.push({
      //     Key: element.Slug,
      //     Value: element,
      //   })
      // });
    }


    this.localService.setSlugWise = SlugWise;
    this.broadcast.broadcast('newTicker');
    this.broadcast.broadcast('tickerNoti');
  }

  delete48hoursold() {
    let storedNews = this.storageService.getProperty('storedNews') || [];
    let todaysDate = moment();
    let createdDate;
    let duration;
    if (storedNews) {
      for (let i = 0; i < storedNews.length; i++) {
        createdDate = moment(storedNews[i].CreatedOn);

        duration = moment.duration(todaysDate.diff(createdDate));
        duration = Math.floor(duration.asHours());
        if (duration >= 48) {
          storedNews.splice(i, 1);
        }
      }
    }
  }

  private itemSplice(storedNews: any, item: any) {
    for (let j = 0; j < storedNews.length; j++) {
      if (storedNews[j].Id == item.Id) {
        storedNews.splice(j, 1);
        j = 0;
      }
    }
    return storedNews
  }
  addNewNews(data) {

    let storedNews = this.storageService.getProperty('storedNews') || [];
    let temp = [];
    temp = data.Data.News;
    if (storedNews) {
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].IsDeleted) {
          storedNews = this.itemSplice(storedNews, temp[i]);
          temp.splice(i, 1);
          i = i - 1;
        }
        else {
          for (let j = 0; j < storedNews.length; j++) {
            if (temp.length > 0) {
              if (storedNews[j].Id == temp[i].Id) {
                storedNews[j] = temp[i];
                temp.splice(i, 1);
              }
            }
          }
        }
        // storedNews.forEach(element => {
        // });
      }
    }

    temp.forEach(element => {
      storedNews.push(element);
    });
    this.storageService.setProperty('storedNews', storedNews);
    // this.tickers = this.localTicker;
    let LastNewsSyncTime = data.Data.LastNewsSyncTime;
    this.storageService.setProperty('LastNewsSyncTime', LastNewsSyncTime);
    this.broadcast.broadcast('newNews');
  }
  getTickersByPollingFunction() {
    let folderID = this.storageService.getProperty('selectedfolderObject');
    this.getTickerByPolling()
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.Data.Tickers.length > 0) {
            this.addNewTickers(data);
          }
          this.broadcast.broadcast('tickerLoading', false);
        }

        this.returnPolling();
      }, err => {
        this.returnPolling();
      });
  }
  getMediaByPollingFunction() {
    this.mediaPolling()
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.Data.resources.length > 0) {
            this.addNewMedia(data);
          }
          // this.broadcast.broadcast('newsLoading', false);
        }
      }, err => {
      });
  }
  getNewsByPollingFunction() {
    let folderID = this.storageService.getProperty('selectedfolderObject');
    this.getNewsByPolling()
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.Data.News.length > 0) {
            this.addNewNews(data);
          }
          this.broadcast.broadcast('newsLoading', false);
        }
      }, err => {
      });
  }
  startPollingByLocal() {
    this.storageService.setProperty('IsPolling', '1');
  }
  stopPollingByLocal() {
    this.storageService.setProperty('IsPolling', '0');
  }
  convertBase64(failedUri) {
    let filePath: string = failedUri;
    let basefile;
    this.base64.encodeFile(filePath).then((base64File: string) => {

      basefile = base64File
      // console.log(basefile);
      return basefile;
    }, (err) => {
      console.log(err);
      return basefile;

    });

  }
  insertToMediaDictionary(data) {

    this.globals.mediaDictionary.Add(data.Id, data);

  }
  saveFailedNews(news) {
    if (news.length > 0) {
      let Base64file = [];
      for (let index = 0; index < news.length; index++) {
        if (news[index].failedURI.length > 0) {
          for (let i = 0; i < news[index].failedURI.length; i++) {
            this.base64.encodeFile(news[index].failedURI[i]).then((base64File: string) => {
              // console.log("BASE64 ",base64File);
              // console.log(this.convertBase64(element));
              if (base64File) {
                Base64file[0] = base64File.toString();
              }
              console.log('before', Base64file)
            },
              err => {
                console.log("error", err);
              });
            console.log('after', Base64file)
          }
          Object.assign(news[index], {
            Base64Stream: Base64file,
          });
        }
      }
    }
    this.insertNews(news).subscribe((data: any) => {
      this.getTickersByPollingFunction();
      this.getNewsByPollingFunction();
      this.getMediaByPollingFunction();
      if (data) {
        if (data.Data) {
          this.storageService.setProperty('failedNews', [])
        }
      }
    }, err => {
      this.getTickersByPollingFunction();
      this.getNewsByPollingFunction();
      this.getMediaByPollingFunction();
    })
  }
  saveFailedTickers(tickers) {
    this.insertTicker(tickers)
      .subscribe((data: any) => {
        this.getTickersByPollingFunction();
        this.getNewsByPollingFunction();
        if (data) {
          if (data.Result) {
            this.storageService.setProperty('failedTicker', []);
          }
        }
      }, (error => {
        this.getTickersByPollingFunction();
        this.getNewsByPollingFunction();
      })

      )
  }
  startPolling() {


    setTimeout(() => {
      // let selectedFolder = this.storageService.getProperty('selectedfolderObject');
      // this.tickerPolling(selectedFolder.Id, this.getLastTickerTime)
      //   .subscribe((data: any) => {
      //     console.log("TICKERPOLLING=>", data);
      //     this.returnPolling();
      //   });
      let failedTicker = [];
      failedTicker = this.storageService.getProperty('failedTicker') || [];
      let failedNews = [];
      failedNews = this.storageService.getProperty('failedNews') || [];

      let startP = this.storageService.getProperty('IsPolling');
      if (startP == '1') {
        if (failedNews.length > 0) {
          this.saveFailedNews(failedNews);
        }
        else if (failedTicker.length > 0) {
          this.saveFailedTickers(failedTicker);
        }
        else {
          this.getTickersByPollingFunction();
          this.getNewsByPollingFunction();
          this.getMediaByPollingFunction();
        }

      }
      else {
        setTimeout(() => {
          this.startPolling();
        }, (10000));
      }
    }, 5000);



  }

  returnPolling() {
    setTimeout(() => {
      this.startPolling();
    }, 5000);

  }
  get getLastMediaTime() {
    let LastMediaSyncTime = this.storageService.getProperty('LastMediaSyncTime');
    return LastMediaSyncTime;
  }
  get getLastNewsTime() {
    let LastNewsSyncTime = this.storageService.getProperty('LastNewsSyncTime');
    return LastNewsSyncTime;
  }
  get getLastTickerTime() {
    let LastTickerSyncTime = this.storageService.getProperty('LastTickerSyncTime');
    return LastTickerSyncTime;
  }
  set setLastTickerTime(time) {
    this.storageService.setProperty('LastTickerSyncTime', time);
  }
  set setLastNewsTime(time) {
    this.storageService.setProperty('LastNewsSyncTime', time);
  }
}



