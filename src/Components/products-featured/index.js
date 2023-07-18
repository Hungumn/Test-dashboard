import { useEffect, useState } from 'react';
import ProductsCarousel from './carousel';
import { useProductFunc } from "src/@core/hooks/use-product";

const ProductsFeatured = () => {
  const { ListProductFunc } = useProductFunc();
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [listProduct, setListProduct] = useState([]);

  useEffect(() => {
    getListProduct();
  }, []);

  const getListProduct = async() => {
    const result = await ListProductFunc({page: 1, limit: 10});
    setListProduct(result);
  };
  return (
    <section className="section section-products-featured">
      <div className="container">
        <header className="section-products-featured__header">
          <h3>Selected just for you</h3>
          <a href="/products" className="btn btn--rounded btn--border">Show All</a>
        </header>

        <ProductsCarousel products={listProduct} />
      </div>
    </section>
  )
};

export default ProductsFeatured