import Breadcrumb from 'src/Components/breadcrumb';
import Footer from 'src/Components/footer';
import ProductsContent from 'src/Components/products-content';
import ProductsFilter from 'src/Components/products-filter';
import Layout from 'src/layouts/Main';
import { useState, useEffect } from 'react';
import { useProductFunc } from "src/@core/hooks/use-product";
import { useCategoryFunc } from 'src/@core/hooks/use-category'
import { useMaterialFunc } from 'src/@core/hooks/use-material'

const Products = () => {
  const { ListProductFunc } = useProductFunc();
  const { ListCategoryFunc } = useCategoryFunc();
  const { ListMaterialFunc } = useMaterialFunc();

  const [listProduct, setListProduct] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listMaterial, setListMaterial] = useState([]);
  const [dataFilter, setDataFilter] = useState({
      page: 1,
      limit: 10,
      productName: "",
      categories: [],   
      materials: [],
      colors: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 0
  });
  useEffect(() => {
    getListProduct();
    getCategories();
    getMaterial();
  }, []);
  

  const getCategories = async () => {
    const data = await ListCategoryFunc()
    setListCategory(data);
  };
  const getMaterial = async () => {
    const data = await ListMaterialFunc();
    setListMaterial(data);
  };
  const getListProduct = async() => {
    const result = await ListProductFunc(dataFilter);
    setListProduct(result);
  } 

  return (
    <>
      <Layout>
        <Breadcrumb title={'All Product'} />
        <section className="products-page">
          <div className="container">
            <ProductsFilter listCategory={listCategory} listMaterial={listMaterial} />
            <ProductsContent listProduct={listProduct} />
          </div>
        </section>
        <Footer />
      </Layout>
    </>
  )
}
  
export default Products
  