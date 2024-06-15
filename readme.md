# API Documentation 
* Service
------------------------------------
1. add_service: <br>
method: post <br>
endpoint: '/service/addService' <br>
body: serviceName, serviceDescription, img, price, category, serviceType <br>
schema: <br>
{<br>
    serviceName: {<br>
        type: String <br>
    },<br> 
    serviceDescription: { <br>
        type: String <br>
    },<br>
    img: {<br>
        type: String <br>
    },<br>
    price: {<br>
        type: Number <br>
    },<br>
    category: {<br>
        type: String // for men or women <br>
    },<br>
    serviceType: {<br>
        type: String <br>
    }<br>
}<br>

2. getAllService <br>
method: get <br>
endpoint: '/service/getAllService' <br>

3. get top services <br>
method: get <br>
endpoint: '/service/getTopServices' <br>

4. delete a service <br>
method: delete <br>
endpoint: '/service/deleteService/:id' <br>

5. getParticularServiceById <br>
method: get <br>
endpoint: '/service/getParticularServiceById/:id' <br>

6. editService <br>
method: put <br>
body: { serviceName, serviceDescription, img, price, category, serviceType } <br>
endpoint: '/service/editService/:id' <br>

* Booking
------------------------------------
1. addBooking <br>
method: post <br>
endpoint: '/booking/addBooking' <br>
body: name, phoneNumber, service, date, time <br>
schema: {<br>
    name: {<br>
        type: String <br>
    },<br>
    phoneNumber: {<br>
        type: String <br>
    },<br>
    service: [{<br>
        serviceName: {<br>
            type: String,<br>
        },<br>
        servicePrice: {<br>
            type: Number,<br>
        }<br>
    }],<br>
    date: {<br>
        type: String <br>
    },<br>
    time: {<br>
        type: String <br>
    },<br>
    confirmationCode: {<br>
        type: String <br>
    }<br>
}<br>

2. getAllBooking <br>
method: get <br>
endpoint: '/booking/getAllBooking' <br>

3. getRecentBooking <br>
method: get <br>
endpoint: '/booking/getRecentBooking' <br>

* Offer
-------------------------------------
1. addOffer <br>
method: post <br>
body: offerName, offerImg, startDate, endDate, usageLimit <br>
endpoint: '/offer/addOffer' <br>
schema: {<br>
    offerName: {<br>
        type: String <br>
    },<br>
    offerImg: {<br>
        type: String <br>
    },<br>
    startDate:{<br>
        type: String <br>
    },<br>
    endDate:{<br>
        type: String <br>
    },<br>
    usageLimit:{<br>
        type: Number <br>
    },<br>
    status:{<br>
        type: String,<br>
        default: "Active" <br>
    }<br>
}<br>

2. getAllOffer <br>
method: get <br>
endpoint: '/offer/getAllOffer' <br>

3. getAllActiveOffer <br>
method: get <br>
endpoint: '/offer/getAllActiveOffer' <br>

4. getAllInactiveOffer <br>
method: get <br>
endpoint: '/offer/getAllInactiveOffer' <br>

5. getParticularOfferById/:id <br>
method: get <br>
endpoint: '/offer/getParticularOfferById/:id' <br>

6. edit a particuler offer <br>
method: put <br>
endpoint: '/offer/editOffer/:id' <br>
body: offerName, offerImg, startDate, endDate, usageLimit, status <br>

* user 
-------------------------------------
getFrequentlyUser <br>
method: get <br>
endpoint: '/user/getFrequentlyUser' <br>

* dashboard
getDashboardData <br>
method: get <br>
endpoint: '/dashboard/getDashboardData' <br>



fetch("localhosthjgkjjgjhgjhghjhgj/service/addService",{
    method: "POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.Stringify({serviceName, serviceDescription, img, price, category, serviceType})
} )
.then(res=>res.json())
.then(data=>console.log(data))

post
put
get
delete