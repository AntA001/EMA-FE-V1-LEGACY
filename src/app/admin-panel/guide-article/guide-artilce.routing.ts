import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { GuidesListComponent } from './guides-list/guides-list.component'
import { AddGuideComponent } from './add-guide/add-guide.component'
import { GuideArticleComponent } from './guide-article.component'

const routes: Routes = [
    {
        path: '',
        component: GuideArticleComponent,
        children: [
            { path: 'list', component: GuidesListComponent },
            { path: 'add', component: AddGuideComponent }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class GuideArticleRoutes {
    // cODE hERE
}
