import {StandardEventNameV0, register} from "@shopify/web-pixels-extension";

register(({ configuration, analytics, browser }) => {
  // Bootstrap and insert pixel script tag here

  // TODO: API key
  // const API_BASE = "https://us-central1-unicron-364ec.cloudfunctions.net/index";

  // // Load customerId from local storage and if it does not exist create it
  // const customerId = localStorage.getItem('customerId') || self.crypto.randomUUID();
  // localStorage.setItem('customerId', customerId);

  // // Step 2. Subscribe to customer events using the analytics.subscribe() API
  // analytics.subscribe("all_events" as StandardEventNameV0, (event, metadata) => {
  //     fetch(`${API_BASE}/track`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         customerId,
  //         event: "shopify_"+event.event_name,
  //         properties: {
  //           metadata,
  //           ...event,
  //         },
  //       }),
  //     });
  // });

    // Sample subscribe to page view
    analytics.subscribe('page_viewed', (event) => {
      console.log('Page viewed', event);
    });
});
