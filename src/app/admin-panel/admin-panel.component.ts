import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit } from '@angular/core'
import { AdminSidebarService } from './admin-shared/admin-sidebar/admin-sidebar.service'

@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
    firstName: any
    lastName: any
    constructor(public sidebarservice: AdminSidebarService, public api: ApiService) {
        // code here
    }

    ngOnInit() {
        this.firstName = this.api.user.name
    }

    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState())
    }
    toggleBackgroundImage() {
        this.sidebarservice.hasBackgroundImage = !this.sidebarservice.hasBackgroundImage
    }
    getSideBarState() {
        return this.sidebarservice.getSidebarState()
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true)
    }
    logOut(): void {
        // this.api.logOutSession().subscribe((resp: any) => {})
        const check = this.api.logOut()
        if (check) {
            window.location.href = '/login'
        }
    }
}
