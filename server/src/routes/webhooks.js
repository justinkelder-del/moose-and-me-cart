import express from 'express';

/**
 * Square webhooks receiver (optional).
 * Configure in Square Dashboard → Webhooks with your public URL.
 * For production, validate signatures per Square docs.
 */
const router = express.Router();

router.post('/square', async (req, res) => {
  // TODO: Validate X-Square-Signature and process event types (payment.updated, order.updated, etc.)
  console.log('Webhook event:', JSON.stringify(req.body, null, 2));
  res.status(200).json({ ok: true });
});

export default router;
