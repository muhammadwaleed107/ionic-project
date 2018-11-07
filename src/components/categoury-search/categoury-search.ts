import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';

/**
 * Generated class for the CategourySearchComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'categoury-search',
  templateUrl: 'categoury-search.html'
})
export class CategourySearchComponent {

  selectedCites =[];
  sc;
  searchText:string;
  Temp = [];
  constructor(
    public viewCtrl: ViewController,
    public params: NavParams
  ) {
    console.log('Hello RDetailPopupComponent Component');
    this.selectedCites = params.get('categories');
    // console.log(this.selectedCites);
    this.Temp =this.selectedCites
  }
  select(sc){
    this.sc = sc;
    this.viewCtrl.dismiss(this.sc);
    // console.log(sc);
  }
  onSearchChange(searchValue : string ) {
    this.selectedCites = this.Temp;
    let searchdata = this.selectedCites.filter(it => {
      return ((it.Category || "").toLowerCase()).includes(searchValue.toLowerCase()); // only filter country name
    });
    this.selectedCites = searchdata;
  //  console.log(searchdata);
  }
  dismiss() {

  }
}
