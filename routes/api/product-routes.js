const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category
        },
        {
          model: Tag
        }
      ]
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product = await Product.findOne({
      include: [
        {
          model: Category
        },
        {
          model: Tag
        },
      ],
      where: {
        id: req.params.id
      }
    });
    if (!product) {
      return res.status(404).json({ error: `No matching Product with id: ${req.params.id}` });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const newProduct = await Product.create(req.body);
    if (req.body.tagIds.length > 0) {
      const productTags = JSON.parse(req.body.tagIds).map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id
        };
      });
      await ProductTag.bulkCreate(productTags);
      const createdProduct = await Product.findByPk(newProduct.id, {
        include: [
          {
            model: Tag
          },
          {
            model: Category
          }
        ]
      })
      return res.status(200).json(createdProduct)
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  try {
    const productId = req.params.id
    // update the product and save the new product
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category
        },
        {
          model: Tag
        },
      ]
    });
    if (!product) {
      res.status(404).json({ error: 'No product found with this ID!' });
      return;
    }
    await Product.update(req.body, {
      where: {
        id: productId,
      },
    });

    // Get all the associated product tags
    const productTags = await ProductTag.findAll({ where: { product_id: productId } });

    // get list of current tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = JSON.parse(req.body.tagIds)
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: productId,
          tag_id,
        };
      });
    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
    
    // Edit the database
    await ProductTag.destroy({ where: { id: productTagsToRemove } });
    await ProductTag.bulkCreate(newProductTags);

    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category
        },
        {
          model: Tag
        }
      ]
    });
    res.status(200).json({updated: updatedProduct, original: product});

  } catch (error) {
    console.log(error);
    res.status(200).json(error);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json({ error: `No matching product with id: ${req.params.id}` })
    } else {
      await Product.destroy({
        where: {
          id: req.params.id,
        }
      });
      res.status(200).json({ message: `Successfully deleted product with ID: ${req.params.id}`, deleted: product });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
