import useSwr from 'swr';
import ProductItem from '../../product-item';
import ProductsLoading from './loading';

const ProductsContent = ({ listProduct }) => {
  // const fetcher = (url) => fetch(url).then((res) => res.json());
  // const { data, error } = useSwr('/api/products', fetcher);

  if (!listProduct.length) return <div>Failed to load users</div>;
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