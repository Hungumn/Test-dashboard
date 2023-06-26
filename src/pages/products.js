import Breadcrumb from 'src/Components/breadcrumb';
import Footer from 'src/Components/footer';
import ProductsContent from 'src/Components/products-content';
import ProductsFilter from 'src/Components/products-filter';
import Layout from 'src/layouts/Main';


const Products = () => (
  <Layout>
    <Breadcrumb />
    <section className="products-page">
      <div className="container">
        <ProductsFilter />
        <ProductsContent />
      </div>
    </section>
    <Footer />
  </Layout>
)
  
export default Products
  