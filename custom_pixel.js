
// Step 1. Add and initialize your third-party JavaScript pixel (make sure to exclude HTML)

const API_BASE = "https://us-central1-unicron-364ec.cloudfunctions.net/analytics";
const API_KEY = "rainbow_unicron"
const COOKIE_NAME = "convertibleCustomerId"

const urlParams = new URLSearchParams(window.location.search);
const qpId = urlParams.get(COOKIE_NAME);

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function randomUUID() {
  if ((typeof crypto !== 'undefined') && crypto.randomUUID !== undefined) {
    return crypto.randomUUID();
  }
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const customerId = (qpId || getCookie(COOKIE_NAME)) || randomUUID();
setCookie(COOKIE_NAME, customerId, 365)

// Step 2. Subscribe to customer events using the analytics.subscribe() API
analytics.subscribe("all_events", event => {   
   fetch(`${API_BASE}/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: API_KEY,
      customerId,
      shopifyCustomerId: event.clientId,

      event: "shopify_"+event.name,
      resource: event.context?.document?.location?.origin + event.context?.document?.location?.pathname,
      
      userAgent: event.context?.navigator?.userAgent,

      revenue: event.data?.checkout?.totalPrice?.amount,
      currency: event.data?.checkout?.currencyCode,
      orderId: event.data?.checkout?.order?.id,
     
      properties: event.data,
    }),
  });
});
