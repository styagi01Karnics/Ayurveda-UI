# Appointment + Payment Link (Server How-To)

**Host:** `http://45.195.229.15`  
**Example hospital:** `GAN-AP`  
**Auth:** hospital Bearer JWT

Ops/testing flow:

1. Hospital admin login  
2. Book appointment (creates patient if needed)  
3. Create invoice  
4. Email PayU payment link to the patient  

## Create payment link

```http
POST /api/v1/payments/links
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "invoiceId": "<uuid>",
  "amount": 10,
  "firstName": "Pradeep",
  "email": "pswain1998@gmail.com",
  "phone": "8328840320",
  "sendEmail": true,
  "upiQr": false
}
```

Response includes `payUrl`, `token`, optional `qrPayload`, `emailSent`, `status`.

### Resend email

```http
POST /api/v1/payments/links/{linkId}/email
```

### Optional UPI QR

Set `"upiQr": true` (requires PayU DBQR enabled on the merchant).

Patient opens `payUrl` → PayU → on SUCCESS, payment-service publishes Kafka `PAYMENT_UPDATED` → billing marks invoice `COMPLETED`.

## Related ports

| Step | Service | Port |
|------|---------|-----:|
| Login | auth | 8111 |
| Doctors | doctor | 8102 |
| Appointment | appointment | 8103 |
| Invoice | billing | 8109 |
| Payment link | payment | 8112 |

Frontend: Billing **Send link** and Generate Invoice **Via Payment / Direct UPI** call `createPaymentLink` / `sendInvoicePaymentLink` in `src/lib/api/payments.ts`.
