
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

const customerId = qpId || getCookie(COOKIE_NAME) || self.crypto.randomUUID();
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
