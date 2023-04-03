export const environment = {
    production: true
}

export const apis = {
    baseUrl: 'https://api.emaadmin.com/api',
    socketUrl: 'https://api.emaadmin.com',
    googleApiKey: 'AIzaSyAprUchXJ6uLf8bxY_7F0BQ6U5Ue5JO9Ko',
    googleCaptchaSiteKey: ''
}

export const socialLoginUrls = {
    google: `${apis.baseUrl}/public/login/google`,
    facebook: `${apis.baseUrl}/public/login/facebook`
}

export const paymentUrl = 'https://api.emaadmin.com/api/student/pay-now'
export const appURL = 'https://emaadmin.com/'
