const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
try {
  const tags = await Tag.findAll({
    include: [
      {
        model:Product
      }
    ]
  });
  res.json(tags);
} catch (error) {
  res.status(500).json({ error });
}

});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk({
      include: [
        {model: Product}
      ],
      where: {
        id: req.params.id
      }
    });
    if (!tag) {
      return res.status(404).json({ error: `No matching Tag with ID: ${req.params.id}`});
    }
    res.json(tag)
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post('/', async (req, res) => {
  // create a new tag
try {
  const newTag = await Tag.create(req.body);
  res.json(newTag);
} catch (error) {
  res.status(500).json({ error });
}
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      res.status(404).json({ error: `No matching Tag with ID: ${req.params.id}`})
    }
    const updatedTag = await Tag.update(
      {}
    )
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
