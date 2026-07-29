import { Order } from '../types';

export const BUSINESS_EMAIL = "rajshrestha021@gmail.com";
export const SENDER_EMAIL = "rajshrestha021@gmail.com";
export const BRAND_NAME = "PinP (Custom Print Shirts & T-Shirts)";

export async function sendOrderNotificationEmails(order: Order, resendApiKey?: string): Promise<{ success: boolean; message: string }> {
  console.log(`[Email Service] Order ${order.id} placed. Dispatching notifications to ${BUSINESS_EMAIL} & ${order.email}...`);

  let dispatched = false;
  
  // 1. Resend API call if key is available
  const apiKey = resendApiKey || (import.meta as any).env?.VITE_RESEND_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'PinP Store <onboarding@resend.dev>',
          to: [BUSINESS_EMAIL, order.email],
          subject: `🛒 NEW ORDER RECEIVED #${order.id} - ${order.customerName}`,
          html: `
            <h2>New Order #${order.id}</h2>
            <p><strong>Customer Name:</strong> ${order.customerName}</p>
            <p><strong>Phone:</strong> ${order.phoneNumber}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Location:</strong> ${order.location} (${order.deliveryArea})</p>
            <p><strong>Product:</strong> ${order.productName} (Size: ${order.size}, Qty: ${order.quantity})</p>
            <p><strong>Total Payable (COD):</strong> NPR ${order.totalPrice}</p>
            <p><strong>Special Notes:</strong> ${order.notes || 'None'}</p>
          `,
        }),
      });

      if (response.ok) {
        dispatched = true;
      }
    } catch (err) {
      console.warn("Direct Resend call failed, falling back to FormSubmit service.", err);
    }
  }

  // 2. FormSubmit AJAX email dispatch (No API Key required)
  try {
    const adminEmailPromise = fetch(`https://formsubmit.co/ajax/${BUSINESS_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: `🚨 NEW ORDER #${order.id} - ${order.customerName} (NPR ${order.totalPrice})`,
        _replyto: order.email,
        "Order ID": order.id,
        "Customer Name": order.customerName,
        "Phone Number": order.phoneNumber,
        "Customer Email": order.email,
        "Exact Delivery Address": order.location,
        "Delivery Region": order.deliveryArea,
        "Product": `${order.productName} (Size ${order.size})`,
        "Quantity": order.quantity,
        "Total Price (COD)": `NPR ${order.totalPrice}`,
        "Notes": order.notes || 'None',
        _captcha: "false"
      }),
    });

    const customerEmailPromise = order.email ? fetch(`https://formsubmit.co/ajax/${order.email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: `Order Confirmation #${order.id} - PinP Custom Shirts`,
        _replyto: BUSINESS_EMAIL,
        "Message": `Thank you ${order.customerName}! Your order has been placed successfully via Cash On Delivery.`,
        "Order Reference": order.id,
        "Product": `${order.productName} (Size ${order.size}, Qty ${order.quantity})`,
        "Total Payable on Delivery": `NPR ${order.totalPrice}`,
        "Delivery Address": order.location,
        "Store Contact": `${BUSINESS_EMAIL} | +977 9800000000`,
        _captcha: "false"
      }),
    }) : Promise.resolve();

    await Promise.allSettled([adminEmailPromise, customerEmailPromise]);
    dispatched = true;
  } catch (formSubmitErr) {
    console.warn("FormSubmit dispatch warning:", formSubmitErr);
  }

  return {
    success: true,
    message: dispatched ? 'Emails dispatched successfully!' : 'Order recorded in system database!',
  };
}
