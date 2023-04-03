export const environment = {
    production: false
}

export const apis = {
    baseUrl: 'http://ema-api.codegenio.com/api',
    socketUrl: 'http://ema-api.codegenio.com',
    googleApiKey: 'AIzaSyCD2nTygZ9zur-WDtgaW5MTK7w4-05k_Oo',
    // googleApiKey: 'AIzaSyBH2NFiXlM-Vt6Z08lo-26AvfyrOV9xvBM',
    googleCaptchaSiteKey: ''
}

export const socialLoginUrls = {
    google: `${apis.baseUrl}/public/login/google`,
    facebook: `${apis.baseUrl}/public/login/facebook`
}
export const paymentUrl = 'http://ema-api.codegenio.com/api/student/pay-now'

export const appURL = 'http://ema.codegenio.com/'
