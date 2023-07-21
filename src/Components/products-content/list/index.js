import ProductItem from '../../product-item';
import ProductsLoading from './loading';
import { Empty } from 'antd';

const ProductsContent = ({ listProduct }) => {
  if (!listProduct || !listProduct.length) return <Empty description={<span>No data matching filter condition</span> } />
  return (
    <>
      {!listProduct &&
        <ProductsLoading />
      }

      {listProduct &&
        <section className="products-list">
          {listProduct.map((item, index)  => (
            <ProductItem
              id={item.productId}
              name={item.productName}
              price={item.price}
              currentPrice={item.price}
              key={index}
              images={item.images}
            />
          ))}
        </section>
      }
    </>
  );
};

export default ProductsContent
