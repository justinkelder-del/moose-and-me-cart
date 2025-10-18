import express from 'express';
import { square } from '../square.js';

const router = express.Router();

/**
 * GET /api/catalog
 * Returns a simplified product list derived from Square Catalog API.
 * Assumes items are created in Square with variations (each with price).
 */
router.get('/', async (req, res) => {
  try {
    const { result } = await square.catalogApi.listCatalog(undefined, 'ITEM,ITEM_VARIATION,IMAGE');
    const objects = result.objects || [];

    const items = objects.filter(o => o.type === 'ITEM');
    const images = objects.filter(o => o.type === 'IMAGE');
    const variations = objects.filter(o => o.type === 'ITEM_VARIATION');

    const imageMap = new Map(images.map(img => [img.id, img.imageData?.url]));
    const varByItem = variations.reduce((acc, v) => {
      const itemId = v.itemVariationData?.itemId;
      if (!itemId) return acc;
      acc[itemId] = acc[itemId] || [];
      acc[itemId].push(v);
      return acc;
    }, {});

    const normalized = items.map(it => {
      const firstVar = (varByItem[it.id] || [])[0];
      const price = firstVar?.itemVariationData?.priceMoney;
      const imageUrl = it.itemData?.imageIds?.length ? imageMap.get(it.itemData.imageIds[0]) : null;
      return {
        id: it.id,
        name: it.itemData?.name,
        description: it.itemData?.description || '',
        imageUrl,
        variationId: firstVar?.id || null,
        priceMoney: price || null
      };
    }).filter(x => !!x.variationId && !!x.priceMoney);

    res.json({ items: normalized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch catalog', details: err?.message });
  }
});

export default router;
