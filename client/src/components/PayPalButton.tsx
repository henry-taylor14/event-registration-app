import React, { useEffect, useRef } from 'react';

interface PayPalButtonProps {
  totalAmount: number;
  onSuccess: (details: any) => void;
  payerName: string;
  payerEmail: string;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ totalAmount, onSuccess, payerName, payerEmail }) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false); // Track if rendered

  useEffect(() => {
    if ((window as any).paypal && paypalRef.current && !renderedRef.current) {
      renderedRef.current = true;
        (window as any).paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal', 
          tagline: false,
        },
        funding: {
          allowed: [
            (window as any).paypal.FUNDING.PAYPAL,
            (window as any).paypal.FUNDING.CARD,
            (window as any).paypal.FUNDING.VENMO
          ],
          disallowed: [
            (window as any).paypal.FUNDING.PAYLATER
          ]
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: totalAmount.toFixed(2),
              },
            }],
            payer: {
              name: {
                given_name: payerName.split(' ')[0] || '',
                surname: payerName.split(' ').slice(1).join(' ') || '',
              },
              email_address: payerEmail,
            },
            application_context: {
              shipping_preference: "NO_SHIPPING",
              user_action: "PAY_NOW",
            }
          });
        },
        onApprove: async (data: any, actions: any) => {
          const details = await actions.order.capture();
          onSuccess(details);
        },
        onError: (err: any) => {
          console.error('PayPal Checkout onError', err);
        },
      }).render(paypalRef.current);
    }
  }, [totalAmount, onSuccess]);

  return <div ref={paypalRef}></div>;
};

export default PayPalButton;
