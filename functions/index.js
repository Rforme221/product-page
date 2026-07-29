const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { Resend } = require("resend");

const resendApiKey = defineSecret("RESEND_API_KEY");

const BUSINESS_EMAIL = "rajshrestha021@gmail.com";
const BRAND_NAME = "PinP (Custom Print Shirts & T-Shirts)";

exports.sendOrderEmails = onDocumentCreated(
  {
    document: "orders/{orderId}",
    secrets: [resendApiKey],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No data associated with the event");
      return;
    }

    const order = snapshot.data();
    const orderId = order.id || event.params.orderId;
    const resend = new Resend(resendApiKey.value() || process.env.RESEND_API_KEY);

    console.log(`Processing email dispatch for Order ID: ${orderId}`);

    // HTML Template 1: Business Order Notification Email
    const businessEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 20px; color: #2c2c2c; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e0d8c8; overflow: hidden; }
          .header { background-color: #1a1a1a; color: #d4af37; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; }
          .content { padding: 24px; }
          .section-title { font-size: 16px; font-weight: bold; color: #8c6d3b; border-bottom: 2px solid #f0e6d2; padding-bottom: 6px; margin-top: 20px; margin-bottom: 12px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .label { font-weight: bold; color: #555; }
          .value { color: #111; }
          .highlight-box { background-color: #fff8e6; border-left: 4px solid #d4af37; padding: 12px 16px; margin: 20px 0; font-weight: bold; color: #7a5800; border-radius: 4px; }
          .footer { font-size: 12px; color: #888; text-align: center; padding: 16px; border-top: 1px solid #eeeeee; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>${BRAND_NAME}</h1>
            <p style="margin:4px 0 0; font-size:13px; color:#ccc;">New Order Received</p>
          </div>
          <div class="content">
            <h2 style="margin-top:0; color:#1a1a1a;">Order #${orderId}</h2>
            <p style="font-size:14px; color:#666;">Received on: ${new Date(order.createdAt).toLocaleString("en-US", { timeZone: "Asia/Kathmandu" })}</p>

            <div class="highlight-box">
              ⚠️ ACTION REQUIRED: Please call the customer soon to confirm this order.
            </div>

            <div class="section-title">Customer Details</div>
            <div class="detail-row"><span class="label">Name:</span> <span class="value">${order.customerName}</span></div>
            <div class="detail-row"><span class="label">Phone:</span> <span class="value"><a href="tel:${order.phoneNumber}">${order.phoneNumber}</a></span></div>
            <div class="detail-row"><span class="label">Email:</span> <span class="value">${order.email}</span></div>
            <div class="detail-row"><span class="label">Delivery Area:</span> <span class="value">${order.deliveryArea}</span></div>
            <div class="detail-row"><span class="label">Exact Address:</span> <span class="value">${order.location}</span></div>
            ${order.notes ? `<div class="detail-row"><span class="label">Order Notes:</span> <span class="value">${order.notes}</span></div>` : ""}

            <div class="section-title">Product & Pricing Details</div>
            <div class="detail-row"><span class="label">Product:</span> <span class="value">${order.productName}</span></div>
            <div class="detail-row"><span class="label">Size:</span> <span class="value">${order.size}</span></div>
            <div class="detail-row"><span class="label">Quantity:</span> <span class="value">${order.quantity} pc(s)</span></div>
            <div class="detail-row"><span class="label">Price per piece:</span> <span class="value">NPR ${order.pricePerPiece}</span></div>
            <div class="detail-row"><span class="label">Delivery Fee:</span> <span class="value">${order.deliveryFee === 0 ? "FREE" : `NPR ${order.deliveryFee}`}</span></div>
            <div class="detail-row" style="font-size:16px; font-weight:bold; margin-top:8px; padding-top:8px; border-top:1px dashed #ccc;">
              <span class="label" style="color:#000;">Total Payable:</span> <span class="value" style="color:#d4af37;">NPR ${order.totalPrice}</span>
            </div>

            <div class="section-title">Payment & Status</div>
            <div class="detail-row"><span class="label">Payment Method:</span> <span class="value">${order.paymentMethod}</span></div>
            <div class="detail-row"><span class="label">Order Status:</span> <span class="value">${order.orderStatus}</span></div>
          </div>
          <div class="footer">
            ${BRAND_NAME} • Automated Notification System
          </div>
        </div>
      </body>
      </html>
    `;

    // HTML Template 2: Customer Confirmation Email
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f7f5f0; margin: 0; padding: 20px; color: #2c2c2c; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e0d8c8; overflow: hidden; }
          .header { background-color: #1a1a1a; color: #d4af37; padding: 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
          .content { padding: 24px; line-height: 1.6; }
          .order-box { background-color: #faf7f2; border: 1px solid #e8e0d0; border-radius: 6px; padding: 16px; margin: 20px 0; }
          .total-row { font-size: 18px; font-weight: bold; color: #2c2c2c; border-top: 2px solid #d4af37; padding-top: 10px; margin-top: 10px; }
          .callout { background-color: #eef7ee; border-left: 4px solid #2e7d32; padding: 12px 16px; color: #1b5e20; border-radius: 4px; margin: 20px 0; font-weight: bold; }
          .footer { font-size: 13px; color: #777; text-align: center; padding: 20px; background-color: #fafafa; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>${BRAND_NAME}</h1>
            <p style="margin:4px 0 0; color:#e0d8c8; font-size:14px;">Order Received!</p>
          </div>
          <div class="content">
            <p>Dear <strong>${order.customerName}</strong>,</p>
            <p>Thank you for choosing <strong>${BRAND_NAME}</strong>! We have received your order and are preparing it for delivery.</p>

            <div class="callout">
              📞 Our sales representative will call you soon to confirm your order details and delivery schedule.
            </div>

            <div class="order-box">
              <h3 style="margin-top:0; color:#8c6d3b;">Order Summary (#${orderId})</h3>
              <p style="margin:4px 0;"><strong>Item:</strong> ${order.productName} (Size: ${order.size})</p>
              <p style="margin:4px 0;"><strong>Quantity:</strong> ${order.quantity}</p>
              <p style="margin:4px 0;"><strong>Delivery Address:</strong> ${order.location}</p>
              <p style="margin:4px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <div class="total-row">
                Total Amount Payable on Delivery: NPR ${order.totalPrice}
              </div>
            </div>

            <p>If you have any questions or need to make changes to your order, feel free to reply to this email or reach us directly at <a href="mailto:${BUSINESS_EMAIL}">${BUSINESS_EMAIL}</a>.</p>

            <p style="margin-top:24px;">Warm regards,<br><strong>Team ${BRAND_NAME}</strong></p>
          </div>
          <div class="footer">
            Thank you for shopping with ${BRAND_NAME} • Kathmandu, Nepal
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      // 1. Send Business Notification
      await resend.emails.send({
        from: `PinP Orders <onboarding@resend.dev>`,
        to: [BUSINESS_EMAIL],
        subject: `New Product Order Received - ${orderId}`,
        html: businessEmailHtml,
      });
      console.log(`Business notification email sent to ${BUSINESS_EMAIL}`);

      // 2. Send Customer Confirmation
      if (order.email && order.email.includes("@")) {
        await resend.emails.send({
          from: `PinP Shirts <onboarding@resend.dev>`,
          reply_to: BUSINESS_EMAIL,
          to: [order.email],
          subject: `Your Order Has Been Received - ${BRAND_NAME}`,
          html: customerEmailHtml,
        });
        console.log(`Customer confirmation email sent to ${order.email}`);
      }
    } catch (err) {
      console.error("Error sending emails via Resend:", err);
    }
  }
);
