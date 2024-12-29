"use client";
import React, { useRef } from "react";
import { useEffect } from "react";

export default function PayPal() {
  const paypalRef = useRef(null);

  useEffect(() => {
    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: (data, actions, err) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  desciption: "Astro report",
                  amount: {
                    currency_code: "USD",
                    value: 1.0,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log("SuccessFull Order");

            console.log(order);
          },
          onError: (err) => {
            console.log(err);
          },
        })
        .render(paypalRef.current);
    }
  }, []);
  return (
    <div>
      <div ref={paypalRef}></div>
    </div>
  );
}
