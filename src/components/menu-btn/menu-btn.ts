import { Component } from '@angular/core';

/**
 * Generated class for the MenuBtnComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu-btn',
  templateUrl: 'menu-btn.html'
})
export class MenuBtnComponent {

  text: string;

  constructor() {
    console.log('Hello MenuBtnComponent Component');
    this.text = 'Hello World';
  }

}
