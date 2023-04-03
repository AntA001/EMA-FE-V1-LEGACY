import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DataService } from './data.service'

@Component({
    selector: 'app-payment-success',
    templateUrl: './payment-success.component.html',
    styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
    info: any = []
    id: any
    paymentData: any

    constructor(
        public ds: DataService,
        public router: Router,
        private route: ActivatedRoute,
        private api: ApiService
    ) {
        this.id = this.route.snapshot.paramMap.get('id')
        if (this.id) {
            this.paymentDetail()
        }
    }

    ngOnInit() {
        // Code
    }

    paymentDetail() {
        this.ds.paymentDetails(this.id).subscribe((resp: any) => {
            if (resp.success) {
                this.paymentData = resp.data
                if (this.paymentData.hasOwnProperty('amount')) {
                    setTimeout(() => {
                        this.router.navigate(['/student/transactions'])
                    }, 2000)
                }
            }
        })
    }
}

