import express from 'express';
import { square, LOCATION_ID } from '../square.js';
import { v4 as uuidv4 } from 'uuid';

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
        catalogObjectId: it.variationId
      }))
    };

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
