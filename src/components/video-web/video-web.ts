import { Component } from '@angular/core';

/**
 * Generated class for the VideoWebComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'video-web',
  templateUrl: 'video-web.html'
})
export class VideoWebComponent {

  text: string;

  constructor() {
    console.log('Hello VideoWebComponent Component');
    this.text = 'Hello World';
  }

}
