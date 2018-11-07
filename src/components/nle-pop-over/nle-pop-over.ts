import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Component } from '@angular/core';
import { HttpServiceProvider } from '../../providers/http-service/http-service';
import { NavParams } from 'ionic-angular/navigation/nav-params';


/**
 * Generated class for the NlePopOverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'nle-pop-over',
  templateUrl: 'nle-pop-over.html'
})
export class NlePopOverComponent {


  resourceId;
  comments;
  MediaRecorder: any;
  constructor(
     public viewCtrl: ViewController,
      public httpService: HttpServiceProvider,
  ) {
    
  }

  toggleRecording(this) {
    //navigator.mediaDevices.getUserMedia({ audio: true })
    //  .then(stream => {
    //    const mediaRecorder = new MediaRecorder(stream);
    //    mediaRecorder.start();

    //    const audioChunks = [];

    //    mediaRecorder.addEventListener("dataavailable", event => {
    //      audioChunks.push(event.data);
    //    });
    //  });
  }
  allBtn() {
  
    this.viewCtrl.dismiss({
      data: { Comment: this.comments}
    });
  }
}
