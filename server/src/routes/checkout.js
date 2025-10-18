import express from 'express';
import { square, LOCATION_ID } from '../square.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/checkout
 * Body: { items: [{ variationId, name, quantity, basePriceMoney:{amount,currency} }], redirectUrl? }
 * Creates an Order + Payment Link (Square-hosted checkout) and returns the link URL.
 * This supports a custom on-site cart managed in the frontend.
 */
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { items = [], redirectUrl } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items to checkout' });
    }

    const order = {
      locationId: LOCATION_ID,
      lineItems: items.map((it) => ({
        quantity: String(it.quantity || 1),
        catalogObjectId: it.variationId, // preferred; price will come from Catalog
        // If you need to override price, use basePriceMoney instead:
        // basePriceMoney: it.basePriceMoney
      }))
    };

    // Create payment link
    const { result } = await square.checkoutApi.createPaymentLink({
      idempotencyKey: uuidv4(),
      order,
      checkoutOptions: {
        redirectUrl: redirectUrl || 'http://localhost:3000/thank-you.html',
        askForShippingAddress: false
      }
    });

    return res.json({ checkoutUrl: result.paymentLink?.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout link', details: err?.message });
  }
});

export default router;
