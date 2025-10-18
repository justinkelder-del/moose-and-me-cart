import express from 'express';
const router = express.Router();

router.post('/square', async (req, res) => {
  console.log('Webhook event:', JSON.stringify(req.body, null, 2));
  res.status(200).json({ ok: true });
});

export default router;
