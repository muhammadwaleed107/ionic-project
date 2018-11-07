import { NlEpagePage } from './../pages/nl-epage/nl-epage';
import { PictureWebComponent } from './../components/picture-web/picture-web';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FileServiceProvider } from '../providers/file-service/file-service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Broadcaster } from '../shared/broadcaster';
import { Globals } from '../shared/global';
import { TickerPage } from '../pages/ticker/ticker';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ReportNewsPage } from '../pages/report-news/report-news';
import { LoginPage } from '../pages/login/login';
import { ApiModule } from './api.module';
import { HttpServiceProvider } from '../providers/http-service/http-service';
import { makeToast } from '../shared/makeToast';
import { StorageService } from '../shared/storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationSearchComponent } from '../components/location-search/location-search';
import { ComponentsModule } from '../components/components.module';
import { FileChooser } from '@ionic-native/file-chooser'
import { FileTransfer } from '@ionic-native/file-transfer';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { NewsStoryPage } from '../pages/news-story/news-story';
import { MakeLoader } from '../shared/makeLoader';
import { FCM } from '@ionic-native/fcm';
import { RequestInterceptor } from './interceptor.module';
import { MystoryPage } from '../pages/mystory/mystory';
import { ImagePicker } from '@ionic-native/image-picker';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { InAppBrowserPage } from '../pages/in-app-browser/in-app-browser';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Base64 } from '@ionic-native/base64';
import { ViewLivePage } from '../pages/view-live/view-live';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { GetToken } from '../shared/getToken';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../environment/environment';
import { FirebaseMessagingProvider } from '../providers/firebase-provider/firebase-provider';
import { IonicStorageModule } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path';
import { Clipboard } from '@ionic-native/clipboard';
import { VideoPlayer } from '@ionic-native/video-player';
import { TickerDetailsComponent } from '../components/ticker-details/ticker-details';
import { RightTabPage } from '../pages/right-tab/right-tab';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { MyAssignmentPage } from '../pages/my-assignment/my-assignment';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TickerPage,
    DashboardPage,
    ReportNewsPage,
    LoginPage,
    NewsStoryPage,
    MystoryPage,
    InAppBrowserPage,
    ViewLivePage,
    RightTabPage,
    TickerDetailsComponent,
    PictureWebComponent,
    NlEpagePage,
    MyAssignmentPage
  ],
  imports: [

    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ComponentsModule,

      ApiModule.forRoot('/'),
    // ApiModule.forRoot('http://52.28.232.38:92/'), //live IP no build
    // ApiModule.forRoot('https://10.3.12.117:8092/'), // DEV
    //  ApiModule.forRoot('https://nms.bolnetwork.com/'),// mobile build
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    InAppBrowserPage,
    TickerPage,
    DashboardPage,
    ReportNewsPage,
    NewsStoryPage,
    MystoryPage,    
    ViewLivePage,
    RightTabPage,
    TickerDetailsComponent,
    PictureWebComponent,
    NlEpagePage,
    MyAssignmentPage
  ],
  schemas:[
    NO_ERRORS_SCHEMA
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileChooser,
    FilePath,
    FirebaseMessagingProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    FCM,
    FileServiceProvider,
    Globals,
    Broadcaster,
    MakeLoader,
    HttpServiceProvider,
    makeToast,
    VideoPlayer,
    FileTransfer,
    StorageService,
    PhotoViewer,
    ImagePicker,
    InAppBrowser,
    Clipboard,
    BrowserTab,
    Base64,
    LocalStorageProvider,
    GetToken
   
  ]
})
export class AppModule { }
