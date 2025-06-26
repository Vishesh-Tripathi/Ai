# Stripe Test Products Setup Guide (Dashboard Method)

## Prerequisites
1. Create a free Stripe account at https://stripe.com
2. You'll automatically be in test mode (no subscription needed!)

## Create Test Products via Dashboard (Recommended)

### Step 1: Access Stripe Dashboard
1. Go to https://dashboard.stripe.com
2. Make sure you're in **Test mode** (toggle in the top-left should say "Test")
3. Navigate to **Products** in the left sidebar

### Step 2: Create Pro Monthly Product
1. Click **"+ Add product"**
2. Fill in:
   - **Name**: `CareerPrepAI Pro`
   - **Description**: `Unlimited resume analysis and interview practice`
   - **Pricing model**: `Standard pricing`
   - **Price**: `$29.00`
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
3. Click **"Save product"**
4. **Copy the Price ID** (starts with `price_`) - you'll need this!

### Step 3: Create Enterprise Monthly Product
1. Click **"+ Add product"**
2. Fill in:
   - **Name**: `CareerPrepAI Enterprise`
   - **Description**: `Pro features plus team dashboard and analytics`
   - **Pricing model**: `Standard pricing`
   - **Price**: `$99.00`
   - **Billing period**: `Monthly`
   - **Currency**: `USD`
3. Click **"Save product"**
4. **Copy the Price ID** (starts with `price_`)

### Step 4: Create Lifetime One-time Product
1. Click **"+ Add product"**
2. Fill in:
   - **Name**: `CareerPrepAI Lifetime`
   - **Description**: `One-time payment for lifetime Pro access`
   - **Pricing model**: `Standard pricing`
   - **Price**: `$299.00`
   - **Billing period**: `One time` (no recurring)
   - **Currency**: `USD`
3. Click **"Save product"**
4. **Copy the Price ID** (starts with `price_`)

## Alternative: Stripe CLI Method (Optional)

If you prefer using CLI:
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`

### 1. Pro Monthly Subscription
```bash
stripe products create \
  --name="CareerPrepAI Pro" \
  --description="Unlimited resume analysis and interview practice"

stripe prices create \
  --product=prod_XXXXXXXXXX \
  --unit-amount=2900 \
  --currency=usd \
  --recurring="interval=month"
```

### 2. Enterprise Monthly Subscription  
```bash
stripe products create \
  --name="CareerPrepAI Enterprise" \
  --description="Pro features plus team dashboard and analytics"

stripe prices create \
  --product=prod_YYYYYYYYYY \
  --unit-amount=9900 \
  --currency=usd \
  --recurring="interval=month"
```

### 3. Lifetime One-time Payment
```bash
stripe products create \
  --name="CareerPrepAI Lifetime" \
  --description="One-time payment for lifetime Pro access"

stripe prices create \
  --product=prod_ZZZZZZZZZZ \
  --unit-amount=29900 \
  --currency=usd
```

## Update Price IDs in Your Code

After creating the products, you'll get real price IDs that look like:
- `price_1QZexample123ABC` (Pro Monthly)
- `price_1QZexample456DEF` (Enterprise Monthly)  
- `price_1QZexample789GHI` (Lifetime)

Replace the placeholder price IDs in `src/app/pricing/page.tsx`:

**Find these lines and replace with your actual price IDs:**
```typescript
// Line ~119: Pro plan button
onClick={() => handleSubscription('price_1QWExamplePro123', 'Pro')}

// Line ~159: Enterprise plan button  
onClick={() => handleSubscription('price_1QWExampleEnt456', 'Enterprise')}

// Line ~189: Lifetime plan button
onClick={() => handleOneTimePayment('price_1QWExampleLife789', 'Lifetime')}
```

## Test the Integration (100% Free!)

**Test Credit Card (Always works, never charges):**
1. Card Number: `4242 4242 4242 4242`
2. Expiry: Any future date (e.g., `12/34`)
3. CVC: Any 3 digits (e.g., `123`)
4. Zip: Any valid zip (e.g., `12345`)

**Other Test Cards:**
- Visa (US): `4242 4242 4242 4242`
- Visa (Debit): `4000 0566 5566 5556`
- Mastercard: `5555 5555 5555 4444`
- American Express: `3782 822463 10005`
- Declined card: `4000 0000 0000 0002`

## Webhook Setup (Optional for Testing)

**For Local Development:**
1. Install Stripe CLI: `npm install -g stripe-cli`
2. Login: `stripe login`
3. Forward events: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Copy the webhook signing secret (starts with `whsec_`)
5. Update `STRIPE_WEBHOOK_SECRET` in your `.env` file

**For Production/Hosted App:**
Add webhook endpoint in Stripe Dashboard → Developers → Webhooks:
- URL: `https://yourdomain.com/api/webhooks/stripe`
- Events: 
  - `checkout.session.completed`
  - `invoice.payment_succeeded` 
  - `invoice.payment_failed`
  - `customer.subscription.deleted`

## Quick Test Steps

1. ✅ Create products in Stripe Dashboard (test mode)
2. ✅ Copy the 3 price IDs 
3. ✅ Update `src/app/pricing/page.tsx` with real price IDs
4. ✅ Start your app: `npm run dev`
5. ✅ Go to `/pricing` page
6. ✅ Click a subscription button
7. ✅ Use test card `4242 4242 4242 4242`
8. ✅ Complete "payment" (no real money!)
9. ✅ Check success page

**Note:** Test mode means no real money is ever charged - everything is simulated!
