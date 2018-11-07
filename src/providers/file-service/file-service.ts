import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the FileServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FileServiceProvider Provider');
  }
  getmenuJson(){
    return this.http.get('assets/menu.json');
  }

}
