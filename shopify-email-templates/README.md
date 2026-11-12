# Phantom Track — Shopify email templates

Branded (dark + purple) versions of every Shopify customer notification.

## How to install one

1. Shopify admin → **Settings → Notifications → Customer notifications**.
2. Click the notification (names below match Shopify's exactly) → **Edit code**.
3. Select all (**Cmd + A**), delete, and paste the **entire** contents of the matching `.liquid` file.
4. **Preview**, then **Send test email**, then **Save**.
5. If anything looks wrong: **Revert to default** in the same editor.

Upload your logo once under **Customize email templates** (`public/logo_light.png`, width **220**) — every template uses it.

## Editing

Don't hand-edit the `.liquid` files — they're generated. Change `build.py` (site URL,
support email, colors and all wording live there) and run:

```bash
python3 shopify-email-templates/build.py
```

## Which file goes where

✅ = link/data variables confirmed against Shopify's default template or docs.
⚠️ = best guess at Shopify's variable for the button/data — **check Preview**; if the
button is missing or a value is blank, revert to default and tell Claude which one.
➖ = you don't use this feature yet; install only if you start (POS, local pickup/delivery, B2B…).

| Shopify notification | File | |
|---|---|---|
| **Order processing** | | |
| Order confirmation | `01-order-processing/order-confirmation.liquid` | ✅ |
| Draft order invoice | `01-order-processing/draft-order-invoice.liquid` | ✅ |
| Shipping confirmation | `01-order-processing/shipping-confirmation.liquid` | ✅ |
| **Local pickup** | | |
| Ready for local pickup | `02-local-pickup/ready-for-local-pickup.liquid` | ✅ ➖ |
| Picked up by customer | `02-local-pickup/picked-up-by-customer.liquid` | ✅ ➖ |
| **Local delivery** | | |
| Order out for local delivery | `03-local-delivery/order-out-for-local-delivery.liquid` | ⚠️ ➖ |
| Order locally delivered | `03-local-delivery/order-locally-delivered.liquid` | ⚠️ ➖ |
| Order missed local delivery | `03-local-delivery/order-missed-local-delivery.liquid` | ⚠️ ➖ |
| **Gift cards** | | |
| New gift card | `04-gift-cards/new-gift-card.liquid` | ✅ (code line ⚠️) |
| Gift card receipt | `04-gift-cards/gift-card-receipt.liquid` | ⚠️ |
| **Store credit** | | |
| Store credit issued | `05-store-credit/store-credit-issued.liquid` | ✅ |
| **Order exceptions** | | |
| Order invoice | `06-order-exceptions/order-invoice.liquid` | ✅ |
| Order edited | `06-order-exceptions/order-edited.liquid` | ✅ |
| Order canceled | `06-order-exceptions/order-canceled.liquid` | ✅ |
| Order payment receipt | `06-order-exceptions/order-payment-receipt.liquid` | ✅ |
| Order refund | `06-order-exceptions/order-refund.liquid` | ✅ |
| Abandoned checkout | `06-order-exceptions/abandoned-checkout.liquid` | 🚫 Moved — Shopify now sends this from **Marketing → Automations** (Shopify Email's visual editor), which doesn't accept this code. Style it there instead. |
| Order link | `06-order-exceptions/order-link.liquid` | ✅ |
| **Payments** | | |
| Payment error | `07-payments/payment-error.liquid` | ✅ |
| Pending payment error | `07-payments/pending-payment-error.liquid` | ⚠️ |
| Pending payment success | `07-payments/pending-payment-success.liquid` | ⚠️ |
| Payment reminder | `07-payments/payment-reminder.liquid` | ⚠️ |
| **Point of Sale** | | |
| POS abandoned checkout | `08-point-of-sale/pos-abandoned-checkout.liquid` | ⚠️ ➖ |
| POS email to customer | `08-point-of-sale/pos-email-to-customer.liquid` | ⚠️ ➖ |
| POS and mobile receipt | `08-point-of-sale/pos-and-mobile-receipt.liquid` | ✅ ➖ |
| POS exchange receipt | `08-point-of-sale/pos-exchange-receipt.liquid` | ✅ ➖ |
| Return receipt | `08-point-of-sale/return-receipt.liquid` | ⚠️ ➖ |
| **Shipping updates** | | |
| Shipping update | `09-shipping-updates/shipping-update.liquid` | ✅ |
| Out for delivery | `09-shipping-updates/out-for-delivery.liquid` | ✅ |
| Delivered | `09-shipping-updates/delivered.liquid` | ✅ |
| **Returns and cancellations** | | |
| Return created | `10-returns/return-created.liquid` | ✅ |
| Order-level return label created | `10-returns/order-level-return-label.liquid` | ✅ |
| Return request approved | `10-returns/return-request-approved.liquid` | ⚠️ |
| Return request declined | `10-returns/return-request-declined.liquid` | ⚠️ |
| Request received | `10-returns/request-received.liquid` | ⚠️ |
| Cancellation request declined | `10-returns/cancellation-request-declined.liquid` | ⚠️ |
| **Accounts and outreach** | | |
| Customer account invite | `11-accounts/customer-account-invite.liquid` | ✅ |
| Customer account welcome | `11-accounts/customer-account-welcome.liquid` | ✅ |
| Customer account password reset | `11-accounts/customer-account-password-reset.liquid` | ✅ |
| Customer payment method add request | `11-accounts/customer-payment-method-add-request.liquid` | ⚠️ |
| Customer payment method update request | `11-accounts/customer-payment-method-update-request.liquid` | ✅ |
| Customer payment method restore request | `11-accounts/customer-payment-method-restore-request.liquid` | ⚠️ |
| B2B access email | `11-accounts/b2b-access-email.liquid` | ⚠️ ➖ |
| B2B location update payment method | `11-accounts/b2b-location-update-payment-method.liquid` | ⚠️ ➖ |
| Contact customer | `11-accounts/contact-customer.liquid` | ✅ |
| Customer email address change confirmation | `11-accounts/customer-email-address-change-confirmation.liquid` | ⚠️ |

## Suggested order

1. Order confirmation, Shipping confirmation, Shipping update, Out for delivery, Delivered.
2. Order canceled, Order refund, Order edited, Order invoice, Abandoned checkout, Order link, Payment error.
3. Returns.
4. Everything else as you need it. (If your store uses Shopify's newer **customer accounts** —
   sign-in with a one-time code — the account invite / welcome / password-reset emails aren't sent.)
