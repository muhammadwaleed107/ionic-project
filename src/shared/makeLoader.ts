import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular/components/loading/loading-controller";

@Injectable()
export class MakeLoader {
  constructor(
    public loadingCtrl:LoadingController,
    public ToastCtrl:ToastController,
  ) {

  }
  makeLoader(message){
    let loader = this.loadingCtrl.create({
      content:message,
    })
    return loader;
  }
  generateToast(Message){
    let toast = this.ToastCtrl.create({
        message:Message,
        duration:3000,
        showCloseButton:true
    });
    return toast.present();
}
}
