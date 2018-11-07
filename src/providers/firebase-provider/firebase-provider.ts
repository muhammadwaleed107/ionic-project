import { Injectable } from "@angular/core";
import { FirebaseApp } from 'angularfire2';
// I am importing simple ionic storage (local one), in prod this should be remote storage of some sort.
// import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';
import { LocalStorageProvider } from "../local-storage/local-storage";
import { Platform } from 'ionic-angular';
@Injectable()
export class FirebaseMessagingProvider {
  private messaging;
  private unsubscribeOnTokenRefresh = () => {};

  constructor(
    // private storage: Storage,
    private app: FirebaseApp,
    private localService:LocalStorageProvider,
    public platform: Platform,
  ) {

    if( this.platform.is('windows') || this.platform.is('core') || this.platform.is('mobileweb')){
      // messaging1 = firebase.messaging();
    this.messaging =firebase.messaging();
    // this.messaging = app.messaging();
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
    this.messaging.useServiceWorker(registration);
    //this.disableNotifications()
    this.enableNotifications();
});
    }
  }

  public enableNotifications() {
    console.log('Requesting permission...');
    return this.messaging.requestPermission().then(() => {
        console.log('Permission granted');
        // token might change - we need to listen for changes to it and update it
        this.setupOnTokenRefresh();
        return this.updateToken();
      });
  }

  public disableNotifications() {
    this.unsubscribeOnTokenRefresh();
    this.unsubscribeOnTokenRefresh = () => {};
    // return this.storage.set('fcmToken','').then();
  }

  private updateToken() {
    if(!this.localService.getDeviceToken)
    {
      return this.messaging.getToken().then((currentToken) => {
        if (currentToken) {
          // we've got the token from Firebase, now let's store it in the database
          console.log(currentToken)
          this.localService.setDeviceToken = currentToken;
          // return this.storage.set('fcmToken', currentToken);
        } else {
          console.log('No Instance ID token available. Request permission to generate one.');
        }
      });
    }

  }

  private setupOnTokenRefresh(): void {
    this.unsubscribeOnTokenRefresh = this.messaging.onTokenRefresh(() => {
      console.log("Token refreshed");
      // this.storage.set('fcmToken','').then(() => { this.updateToken(); });
    });
  }

}
