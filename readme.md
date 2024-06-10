# API Documentation 
* Service
------------------------------------
1. add_service:
method: post 
endpoint: '/service/addService'
body: serviceName, serviceDescription, img, price, category, serviceType
schema:
{
    serviceName: {
        type: String
    },
    serviceDescription: {
        type: String
    },
    img: {
        type: String
    },
    price: {
        type: Number
    },
    category: {
        type: String // for men or women
    },
    serviceType: {
        type: String
    }
}



2. getAllService
method: get
endpoint: '/service/getAllService'

3. get top services
method: get
endpoint: '/service/getTopServices'

4. delete a service
method: delete 
endpoint: '/service/deleteService/:id'

5. getParticularServiceById
method: get 
endpoint: '/service/getParticularServiceById/:id'

6. editService
method: put 
body: { serviceName, serviceDescription, img, price, category, serviceType }
endpoint: '/service/editService/:id'



* Booking
------------------------------------
1. addBooking
method: post 
endpoint: '/booking/addBooking'
body: name, phoneNumber, service, date, time
schema: {
    name: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    service: [{
        serviceName: {
            type: String,
        },
        servicePrice: {
            type: Number,
        }
    }],
    date: {
        type: String
    },
    time: {
        type: String
    },
    confirmationCode: {
        type: String
    }
}

2. getAllBooking
method: get 
endpoint: '/booking/getAllBooking'

3. getRecentBooking
method: get 
endpoint: '/booking/getRecentBooking'




* Offer
-------------------------------------
1. addOffer
method: post 
body: offerName, offerImg, startDate, endDate, usageLimit 
endpoint: '/offer/addOffer'
schema: {
    offerName: {
        type: String
    },
    offerImg: {
        type: String
    },
    startDate:{
        type: String
    },
    endDate:{
        type: String
    },
    usageLimit:{
        type: Number
    },
    status:{
        type: String,
        default: "Active"
    }
}

2. getAllOffer
method: get 
endpoint: '/offer/getAllOffer'

3. getAllActiveOffer
method: get 
endpoint: '/offer/getAllActiveOffer'

4. getAllInactiveOffer
method: get 
endpoint: '/offer/getAllInactiveOffer'

5. getParticularOfferById/:id
method: get 
endpoint: '/offer/getParticularOfferById/:id'

6. edit a particuler offer 
method: put 
endpoint: '/offer/editOffer/:id'
body: offerName, offerImg, startDate, endDate, usageLimit, status 



* user 
-------------------------------------
getFrequentlyUser
method: get 
endpoint: '/user/getFrequentlyUser'


* dashboard
getDashboardData
method: get 
endpoint: '/dashboard/getDashboardData'