import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';

/**
 * Generated class for the FolderDropdownComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'folder-dropdown',
  templateUrl: 'folder-dropdown.html'
})
export class FolderDropdownComponent {

  text: string;
  selectedFolder =[];
  sc;
  searchText:string;
  Temp = [];
  constructor(
    public viewCtrl: ViewController,
    public params: NavParams
  ) {
    console.log('Hello RDetailPopupComponent Component');
    this.text = 'Hello World';
    this.selectedFolder = params.get('folders');

    this.selectedFolder.splice(0,1);

    this.Temp =this.selectedFolder
  }
  select(sc){
    this.sc = sc;
    this.viewCtrl.dismiss(this.sc);
    // console.log(sc);
  }
  onSearchChange(searchValue : string ) {
    this.selectedFolder = this.Temp;
    if(this.selectedFolder){
    let searchdata = this.selectedFolder.filter(it => {
      return ((it.Name || "").toLowerCase()).includes(searchValue.toLowerCase()); // only filter country name
    });
    this.selectedFolder = searchdata;
  }
  //  console.log(searchdata);
  }
  dismiss() {

  }
}
