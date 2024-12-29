"use client";
import React, { useEffect, useState } from "react";

const PAYPAL_SCRIPT =
  process.env.NODE_ENV === "production"
    ? process.env.PAYPAL_SCRIPT_URL
    : process.env.SANDBOX_SCRIPT_URL;

const PayPalLoader = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const PAYPAL_URL = PAYPAL_SCRIPT | "";
    const isPaypalScriptLoaded = !!document.querySelector(
      `script[src="${PAYPAL_URL}"]`
    );

    if (isPaypalScriptLoaded) {
      console.log("PayPal script already loaded");
      setScriptLoaded(true);
      return;
    }

    if (window.paypal) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = PAYPAL_URL;
    script.async = true;

    script.onload = () => {
      console.log("PayPal script loaded successfully");
      setScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("PayPal script failed to load");
      setError("Failed to load payment system. Please try again later.");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup if necessary, for instance, removing the script
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [PAYPAL_SCRIPT]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!scriptLoaded) {
    return <div>Loading payment system...</div>;
  }

  return null;
};

export default PayPalLoader;
