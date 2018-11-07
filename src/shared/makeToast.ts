import { ToastController } from "ionic-angular/components/toast/toast-controller";

import {  Injectable } from '@angular/core';

@Injectable()
export class makeToast{
constructor(
    public ToastCtrl:ToastController,
){

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
