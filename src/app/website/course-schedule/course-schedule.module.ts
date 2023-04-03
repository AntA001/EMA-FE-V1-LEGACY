import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CourseScheduleComponent } from './course-schedule.component'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: CourseScheduleComponent }
        ])
    ],
    declarations: [CourseScheduleComponent]
})
export class CourseScheduleModule {
    // code here
}
