import ReactGA from "react-ga4";

export const initGA = () => {
  const gaId = process.env.REACT_APP_GA_ID;

  if (!gaId) return;

  ReactGA.initialize(gaId);
};

export const trackPageView = () => {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.pathname,
  });

  // Contentsquare SPA tracking
  if (window._uxa) {
    window._uxa.push([
      "trackPageview",
      window.location.pathname,
    ]);
  }
};

export const initContentsquare = () => {
  const csId = process.env.REACT_APP_CONTENTSQUARE_ID;

  if (!csId) return;

  window._uxa = window._uxa || [];

  const script = document.createElement("script");

  script.type = "text/javascript";
  script.async = true;

  script.src = `https://t.contentsquare.net/uxa/${csId}.js`;

  document.head.appendChild(script);
};