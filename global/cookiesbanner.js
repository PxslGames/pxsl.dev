(function () {
    const consentKey = "cookiesaccept";
  
    if (localStorage.getItem(consentKey) === "true") {
      loadGoogleAnalytics();
      return;
    }
  
    const style = document.createElement("style");
    style.textContent = `
      #cookiesacceptoverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000000;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
        cursor: pointer;
        z-index: 9999;
        flex-direction: column;
        text-align: center;
        cursor: none;
      }
  
      #cookiesacceptoverlay:hover {
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);
  
    // Create the overlay
    const overlay = document.createElement("div");
    overlay.id = "cookiesacceptoverlay";
    overlay.innerHTML = `
      <div>This website uses cookies. Click anywhere to accept.</div>
      <small style="margin-top: 10px; font-size: 1rem; color: #aaa;">pxsl.dev vibes</small>
    `;
  
    // Prevent scrolling behind overlay
    document.body.style.overflow = "hidden";
    document.body.appendChild(overlay);
  
    // When user clicks the overlay
    overlay.addEventListener("click", () => {
      localStorage.setItem(consentKey, "true");
      overlay.remove();
      document.body.style.overflow = "";
      loadGoogleAnalytics();
    });
  
    function loadGoogleAnalytics() {
      const gaScript = document.createElement("script");
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-CEN3W87631";
      gaScript.async = true;
      document.head.appendChild(gaScript);
  
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", "G-CEN3W87631");
    }
  })();