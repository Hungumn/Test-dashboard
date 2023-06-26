// fake data
import products from 'src/utils/data/products'

export default (req, res) => {
  // fake loading time
  setTimeout(() => {
    res.status(200).json(products)
  }, 800)
}
