import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';



@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(public loadingCtrl: LoadingController) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (request.url != "/api/Transaction/AddMultipleTransactions") {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",

    });
    // loader.present();
    return next.handle(request).do((event: HttpEvent<any>) => {

      if (event instanceof HttpResponse) {
        // loader.dismiss();
        // if (event.body.isSuccess == true && event.body.data) {

        // }
        // else {

        // }

      }

    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        // loader.dismiss();
        if (err.status === 401) {

        }
      }
    });
    // }
  }
}
