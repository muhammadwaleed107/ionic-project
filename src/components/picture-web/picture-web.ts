import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
/**
 * Generated class for the PictureWebComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'picture-web',
  templateUrl: 'picture-web.html'
})
export class PictureWebComponent {

  imgURL: string;
  videoURL:string;
  myimg = new Image();
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {

    this.imgURL = this.params.get('imgURL');
    this.videoURL = this.params.get('videoURL');
    console.log(this.imgURL);
    if(this.imgURL){
      this.myimg.src = this.imgURL; 
    }
    console.log('imageObject=>',this.myimg.height);
  }
  close(){
    this.viewCtrl.dismiss();
  }

}
