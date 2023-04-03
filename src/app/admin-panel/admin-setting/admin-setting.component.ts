import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { AdminSettingService } from './admin-setting.service'
import iro from '@jaames/iro'
@Component({
    selector: 'app-admin-setting',
    templateUrl: './admin-setting.component.html',
    styleUrls: ['./admin-setting.component.css']
})
export class AdminSettingComponent implements OnInit {
    colorPicker: any
    blockedSlotColorPicker: any
    settingForm: FormGroup
    loginLoading = false
    waiting: {
        search: boolean
        save: boolean
    }
    breadCrum = [
        {
            link: '/admin/settings',
            value: 'Settings'
        }
    ]
    constructor(
        public ds: AdminSettingService,
        private api: ApiService,
        private router: Router,
        private fb: FormBuilder,
        public ui: UIHelpers,
        public alert: IAlertService
    ) {
        this.waiting = {
            search: false,
            save: false
        }

        this.settingForm = this.fb.group({
            id: new FormControl(null),
            makeupClassColor: new FormControl(null, [Validators.required]),
            blockedSlotColor: new FormControl(null, [Validators.required])
        })
    }

    ngOnInit(): void {
        this.settingForm.get('makeupClassColor')?.valueChanges.subscribe((value) => {
            if (value !== null && value.length === 7) {
                // this.colorPicker.color.hexString = value
                this.colorPicker = value
            }
        })

        this.settingForm.get('blockedSlotColor')?.valueChanges.subscribe((value) => {
            if (value !== null && value.length === 7) {
                this.blockedSlotColorPicker = value
            }
        })

        this.getSettings()
    }

    get g() {
        return this.settingForm.controls
    }

    getSettings() {
        const list = this.ds.settings()

        list.subscribe((resp: any) => {
            if (resp.success === true) {
                this.settingForm.patchValue(resp.data)

                let colorName: any
                colorName = this.settingForm.value.makeupClassColor
                this.colorPicker = iro.ColorPicker('#picker', {
                    width: 200,
                    color: colorName,
                    borderWidth: 1,
                    borderColor: '#fff',
                    layout: [
                        {
                            component: iro.ui.Box
                        },
                        {
                            component: iro.ui.Slider,
                            options: {
                                id: 'hue-slider',
                                sliderType: 'hue'
                            }
                        }
                    ]
                })

                this.colorPicker.on('color:change', (color: { hexString: any }) => {
                    this.settingForm.get('makeupClassColor')?.setValue(color.hexString)
                })

                let blockedSlotColorName: any
                blockedSlotColorName = this.settingForm.value.blockedSlotColorName
                this.blockedSlotColorPicker = iro.ColorPicker('#blockeSlotpicker', {
                    width: 200,
                    color: blockedSlotColorName,
                    borderWidth: 1,
                    borderColor: '#fff',
                    layout: [
                        {
                            component: iro.ui.Box
                        },
                        {
                            component: iro.ui.Slider,
                            options: {
                                id: 'hue-slider',
                                sliderType: 'hue'
                            }
                        }
                    ]
                })

                this.blockedSlotColorPicker.on('color:change', (color: { hexString: any }) => {
                    this.settingForm.get('blockedSlotColor')?.setValue(color.hexString)
                })
            }
        })
    }

    save(f: any) {
        this.waiting.save = true
        if (this.settingForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }

        this.ds.save(this.settingForm.value).subscribe((resp: any) => {
            this.waiting.save = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return
            }

            this.alert.success('Change Successfully!!')
            // f.resetForm()
        })
    }
}
