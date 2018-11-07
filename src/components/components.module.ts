import { NgModule } from '@angular/core';
import { LocationSearchComponent } from './location-search/location-search';
import { MyApp } from '../app/app.component';
import { IonicModule } from 'ionic-angular/module';
import { CategourySearchComponent } from './categoury-search/categoury-search';
import { FolderDropdownComponent } from './folder-dropdown/folder-dropdown';
import { AddTickerComponent } from './add-ticker/add-ticker';
import { MoveFolderComponent } from './move-folder/move-folder';
import { VideoWebComponent } from './video-web/video-web';

import { NewsCommentsComponent } from './news-comments/news-comments';
import { MenuBtnComponent } from './menu-btn/menu-btn';
import { TickerDetailsComponent } from './ticker-details/ticker-details';
import { SlugSearchComponent } from './slug-search/slug-search';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { RightTabPage } from '../pages/right-tab/right-tab';
import { NlePopOverComponent } from './nle-pop-over/nle-pop-over';


@NgModule({
	declarations: [LocationSearchComponent,
    CategourySearchComponent,
    FolderDropdownComponent,
    AddTickerComponent,
    MoveFolderComponent,
    VideoWebComponent,
    NewsCommentsComponent,
    MenuBtnComponent,
   
    SlugSearchComponent,
    NlePopOverComponent,
    

    ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  
  entryComponents:[   
    LocationSearchComponent,
    CategourySearchComponent,
    FolderDropdownComponent,
    AddTickerComponent,
    MoveFolderComponent,
    NewsCommentsComponent,
    MenuBtnComponent,
    NlePopOverComponent,
    SlugSearchComponent,
    
    
  ],
	exports: [LocationSearchComponent,
    CategourySearchComponent,
    FolderDropdownComponent,

    MoveFolderComponent,
    VideoWebComponent,
    
    NewsCommentsComponent,
    MenuBtnComponent,
    SlugSearchComponent,
    NlePopOverComponent,

    ]
})
export class ComponentsModule {}
