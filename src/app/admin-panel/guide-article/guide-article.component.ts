import { Pagination, Resp } from 'src/app/interfaces/response'
import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Component, TemplateRef, OnInit, OnDestroy } from '@angular/core'
import { GuideArticle } from 'src/app/models/guide-article'
import { QuillEditorComponent } from 'ngx-quill'
@Component({
  selector: 'app-guide-article',
  templateUrl: './guide-article.component.html',
  styleUrls: ['./guide-article.component.css']
})
export class GuideArticleComponent {

  constructor() {
    // Code Here
  }

}
