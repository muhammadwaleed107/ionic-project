import { Injectable } from "@angular/core";
import { FCM } from '@ionic-native/fcm';
import { makeToast } from './makeToast';
import { Broadcaster } from "./broadcaster";
import { LocalStorageProvider } from "../providers/local-storage/local-storage";

@Injectable()
export class GetToken {

  constructor(
    private fcm: FCM,
    private maketoast: makeToast,
    public broadcaster : Broadcaster,
    public localService: LocalStorageProvider
  ) {

  }
  getDeviceToken() {
    if(this.localService.getDeviceToken){
      return
    }
    this.fcm.getToken().then(token => {
      if (token) {
        localStorage.setItem('deviceToken', JSON.stringify(token));
        console.log('token:', token);
        this.maketoast.generateToast("Fetched Token!");
        this.broadcaster.broadcast('login');
      }
      else{
        this.maketoast.generateToast("Network Error");
      }
      // backend.registerToken(token);
    });

  }
}
