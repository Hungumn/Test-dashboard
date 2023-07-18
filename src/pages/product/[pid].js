import { GetServerSideProps } from 'next'

import { useState } from 'react';
import Layout from 'src/layouts/Main';
import Gallery from 'src/Components/product-single/gallery';
import Content from 'src/Components/product-single/content';
import Description from 'src/Components/product-single/description';
import Reviews from 'src/Components/product-single/reviews';
import { server } from 'src/utils/server'; 
import ProductsFeatured from 'src/Components/products-featured';
import Footer from 'src/Components/footer';
import Breadcrumb from 'src/Components/breadcrumb';
import { useProductFunc } from "src/@core/hooks/use-product";
import { useRouter } from 'next/router';
import { useEffect } from 'react';


// export const getServerSideProps = async ({ query }) => {
//   const pid = query.pid;
//   const res = await fetch(`${server}/api/product/${pid}`);
//   const product = await res.json();

//   return {
//     props: {
//       product,
//     },
//   }
// }

const Product = () => {
  const router = useRouter();
  const [showBlock, setShowBlock] = useState('description');
  const { ProductDetailFunc } = useProductFunc();

  const [product, setProduct] = useState({
    productId: "",
    productName: "",
    images: "",
    quantity: "",
    price: "",
    description: "",
    productTechnicals: []
  });

  useEffect(() => {
    getProductDetail();
  }, []);

  const getProductDetail = async() => {
    const result = await ProductDetailFunc(router.query.pid);
    console.log('result...',result);
    setProduct(result);
  };

  return (
    <Layout>
      <Breadcrumb title={`product / ${product.productName}`}/>

      <section className="product-single">
        <div className="container">
          <div className="product-single__content">
            <Gallery images={product.images ? [product.images] : []} />
            <Content product={product} />
          </div>

          <div className="product-single__info">
            <div className="product-single__info-btns">
              <button type="button" onClick={() => setShowBlock('description')} className={`btn btn--rounded ${showBlock === 'description' ? 'btn--active' : ''}`}>Description</button>
              <button type="button" onClick={() => setShowBlock('reviews')} className={`btn btn--rounded ${showBlock === 'reviews' ? 'btn--active' : ''}`}>Reviews (2)</button>
            </div>

            <Description show={showBlock === 'description'} />
            {/* <Reviews product={product} show={showBlock === 'reviews'} /> */}
          </div>
        </div>
      </section>

      <div className="product-single-page">
        <ProductsFeatured />
      </div>
      <Footer />
    </Layout>
  );
}

export default Product
