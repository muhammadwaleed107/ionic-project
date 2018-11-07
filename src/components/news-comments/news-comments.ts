
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/**
 * Generated class for the NewsCommentsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'news-comments',
  templateUrl: 'news-comments.html'
})
export class NewsCommentsComponent {

  commentText: string;
  commentsData;
  constructor(
    private navparam : NavParams
  ) {
    // TODO://get all comments from Nav params
  this.commentsData =   this.navparam.get('commentsData');
  }
  addComment(){
    // TODO:// Insert New comment  Here
    console.log('comment=>',this.commentText);
  }

}
