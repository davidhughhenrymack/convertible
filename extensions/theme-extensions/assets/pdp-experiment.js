
const ACTION_SPACE = "show-micro-pdp-1";
const SHOW_KEY = 'convertibleExperiment_' + ACTION_SPACE;
const CUSTOMER_KEY = 'convertibleCustomerId'
const API_BASE = "https://us-central1-unicron-364ec.cloudfunctions.net/analytics";

class PDPExperiment extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("connectedCallback 1.2");

    this.pdpContainer = this.querySelector("#pdp-container");
    this.pdpLoader = this.querySelector(".pdp-loader");

    // Load customerId from local storage and if it does not exist create it
    const customerId = localStorage.getItem(CUSTOMER_KEY) || self.crypto.randomUUID();
    localStorage.setItem(CUSTOMER_KEY, customerId);

    this.showPDP = localStorage.getItem(SHOW_KEY)

    if (!this.showPDP) {
      // Send identify event to backend
      fetch(`${API_BASE}/decide/${ACTION_SPACE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          apiKey: window?.location?.hostname,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        this.showPDP = data?.decisions?.[0]?.choiceId;
        localStorage.setItem(SHOW_KEY, this.showPDP);
        this.updateVisible();
      });
    }
    else {
      this.updateVisible();
    }
  }

  updateVisible() {
    this.pdpContainer.style.display = this.showPDP === "true" ? "block" : "none";
    this.pdpLoader.style.display = this.showPDP === null ? "block" : "none";
  }
}

customElements.define('pdp-experiment', PDPExperiment)