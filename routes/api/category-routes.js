const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
   const categories = await Category.findAll({
    include: [
      {
        model: Product
      }
    ]
   });
   res.json(categories)
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const category = await Category.findOne({
      include: [
        {
          model: Product
        }
      ],
      where: {
        id: req.params.id
      }
    });
    if (!category) {
      return res.status(404).json({ error: `No matching category`});
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = req.body;
    const createdCategory = await Category.create(newCategory);
    res.json(createdCategory);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const categoryId = req.params.id
    const categoryName = req.body.category_name;
    const category = await Category.findByPk(categoryId)
    if (!category) {
      res.status(404).json({ error: `No matching Category with id: ${categoryId}` });
    }
    const updatedCategory = await Category.update(
      {category_name: categoryName},
      {where: {id: categoryId}}
      )
    console.log(updatedCategory);
    res.json({ message: `Category with an ID of ${categoryId} was updated`} )
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      res.status(404).json({ error});
      return;
    }
    await Category.destroy({
      where: {
        id: req.params.id,
      }
    });
    res.status(200).json({message: `Successfully Deleted Category with ID: ${req.params.id}`})
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
