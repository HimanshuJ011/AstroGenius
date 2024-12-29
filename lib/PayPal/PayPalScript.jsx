"use client";
import React, { useRef, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PAYPAL_CLIENT_ID =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    : process.env.NEXT_PUBLIC_SANDBOX_CLIENT_ID;

const PAYPAL_OPTIONS = {
  "client-id": PAYPAL_CLIENT_ID,
  currency: "USD",
  "enable-funding": "venmo",
  "disable-funding": "card,credit",
};

export default function PayPalScript({ onPaymentSuccess }) {
  const paypalRef = useRef(null);

  const verifyPayment = async (orderID) => {
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderID }),
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.verified) {
        throw new Error(data.message || "Verification failed");
      }

      return true;
    } catch (error) {
      console.error("Verification error:", error);
      return false;
    }
  };

  const handlePaymentApproval = async (actions) => {
    try {
      const order = await actions.order.capture();
      console.log("Order captured:", order);

      const verified = await verifyPayment(order.id);
      if (verified) {
        setPaymentCompleted(true);
        onPaymentSuccess(order);
      } else {
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Error during payment approval:", error);
      alert(
        "An error occurred while processing your payment. Please try again."
      );
    }
  };

  return (
    <PayPalScriptProvider options={PAYPAL_OPTIONS}>
      <div ref={paypalRef}>
        <PayPalButtons
          style={{ layout: "vertical", color: "blue", shape: "pill" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "Astro report",
                  amount: {
                    currency_code: "USD",
                    value: "1.00",
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            if (!actions) return;
            await handlePaymentApproval(actions);
          }}
          onError={(err) => {
            console.error("PayPal Checkout onError", err);
            alert("An error occurred during checkout. Please try again.");
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}

// const PAYPAL_OPTIONS = {
//   "client-id": PAYPAL_CLIENT_ID,
//   currency: "USD",
//   intent: "capture",
//   components: "buttons",
//   "enable-funding": "venmo",
//   "disable-funding": "card,credit",
// };

// export default function PayPalScript({ onPaymentSuccess }) {
//   const paypalRef = useRef(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Verify PayPal client ID is available
//     if (!PAYPAL_CLIENT_ID) {
//       setError("PayPal client ID is not configured");
//       setLoading(false);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const handleCreateOrder = async (data, actions) => {
//     try {
//       console.log("Creating order...", data);
//       return actions.order.create({
//         intent: "CAPTURE",
//         purchase_units: [
//           {
//             description: "Astro report",
//             amount: {
//               currency_code: "USD",
//               value: "1.00",
//             },
//           },
//         ],
//       });
//     } catch (err) {
//       console.error("Error creating order:", err);
//       setError("Failed to create order. Please try again.");
//       throw err;
//     }
//   };

//   const handleApprove = async (data, actions) => {
//     try {
//       setLoading(true);
//       const order = await actions.order.capture();
//       console.log("Payment successful:", order);
//       onPaymentSuccess(order);
//     } catch (err) {
//       console.error("Error capturing payment:", err);
//       setError("Payment failed. Please try again.");
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleError = (err) => {
//     console.error("PayPal Error:", err);
//     setError("Payment processing error. Please try again.");
//   };

//   if (loading) {
//     return <div>Loading payment options...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   return (
//     <PayPalScriptProvider options={PAYPAL_OPTIONS}>
//       <div ref={paypalRef}>
//         <PayPalButtons
//           style={{
//             layout: "vertical",
//             color: "blue",
//             shape: "pill",
//             label: "pay",
//           }}
//           createOrder={handleCreateOrder}
//           onApprove={handleApprove}
//           onError={handleError}
//         />
//       </div>
//     </PayPalScriptProvider>
//   );
// }

// export default function PayPalScript({ onPaymentSuccess }) {
//   const paypalRef = useRef(null);

//   const verifyPayment = async (orderID) => {
//     try {
//       const response = await fetch("/api/payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ orderID }),
//         credentials: 'same-origin'
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (!data.verified) {
//         throw new Error(data.message || "Verification failed");
//       }

//       return true;
//     } catch (error) {
//       console.error("Verification error:", error);
//       return false;
//     }
//   };

//   return (
//     <PayPalScriptProvider options={PAYPAL_OPTIONS}>
//       <div ref={paypalRef}>
//         <PayPalButtons
//           style={{ layout: "vertical", color: "blue", shape: "pill" }}
//           createOrder={(data, actions) => {
//             return actions.order.create({
//               intent: "CAPTURE",
//               purchase_units: [{
//                 description: "Astro report",
//                 amount: {
//                   currency_code: "USD",
//                   value: "1.00",
//                 },
//               }],
//             });
//           }}
//           onApprove={async (data, actions) => {
//             const order = await actions.order.capture();
//             console.log(order);

//             const verified = await verifyPayment(order.id);

//             if (verified) {
//               console.log();

//               onPaymentSuccess(order);
//             } else {
//               console.error("Payment verification failed");
//               // Handle verification failure (show error to user)
//             }
//           }}
//           onError={(err) => {
//             console.error("PayPal Checkout onError", err);
//           }}
//         />
//       </div>
//     </PayPalScriptProvider>
//   );
// }
