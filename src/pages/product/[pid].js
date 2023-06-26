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


export const getServerSideProps = async ({ query }) => {
  const pid = query.pid;
  const res = await fetch(`${server}/api/product/${pid}`);
  const product = await res.json();

  return {
    props: {
      product,
    },
  }
}

const Product = ({ product }) => {
  const [showBlock, setShowBlock] = useState('description');

  return (
    <Layout>
      <Breadcrumb />

      <section className="product-single">
        <div className="container">
          <div className="product-single__content">
            <Gallery images={product.images} />
            <Content product={product} />
          </div>

          <div className="product-single__info">
            <div className="product-single__info-btns">
              <button type="button" onClick={() => setShowBlock('description')} className={`btn btn--rounded ${showBlock === 'description' ? 'btn--active' : ''}`}>Description</button>
              <button type="button" onClick={() => setShowBlock('reviews')} className={`btn btn--rounded ${showBlock === 'reviews' ? 'btn--active' : ''}`}>Reviews (2)</button>
            </div>

            <Description show={showBlock === 'description'} />
            <Reviews product={product} show={showBlock === 'reviews'} />
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
