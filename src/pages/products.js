import Breadcrumb from 'src/Components/breadcrumb';
import Footer from 'src/Components/footer';
import ProductsContent from 'src/Components/products-content';
import ProductsFilter from 'src/Components/products-filter';
import Layout from 'src/layouts/Main';
import { useState, useEffect } from 'react';
import { useProductFunc } from "src/@core/hooks/use-product";
import { useCategoryFunc } from 'src/@core/hooks/use-category'
import { useMaterialFunc } from 'src/@core/hooks/use-material'
import { useDebounce } from 'use-debounce';
import { Pagination } from 'antd';

const Products = () => {
  const { ListProductFunc } = useProductFunc();
  const { ListCategoryFunc } = useCategoryFunc();
  const { ListMaterialFunc } = useMaterialFunc();

  const [listProduct, setListProduct] = useState([]);
  const [totalCount, setTotalCount] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listMaterial, setListMaterial] = useState([]);
  const [dataFilter, setDataFilter] = useState({
      page: 1,
      limit: 15,
      productName: "",
      categories: [],
      materials: [],
      colors: [],
      sizes: [],
      minPrice: 0,
      maxPrice: 0
  });
  const [filter] = useDebounce(dataFilter, 500);
  useEffect(() => {
    getListProduct();
  }, [filter]);

  useEffect(() => {
    getCategories();
    getMaterial();
  }, []);

  const handleChangePagination = (page) => {
    setDataFilter({...dataFilter, page});
  };

  const getCategories = async () => {
    const data = await ListCategoryFunc()
    setListCategory(data.data);
  };
  const getMaterial = async () => {
    const data = await ListMaterialFunc();
    setListMaterial(data);
  };
  const getListProduct = async() => {
    const result = await ListProductFunc(filter);
    setListProduct(result.data);
    setTotalCount(result.totalCount);
  }

  return (
    <>
      <Layout>
        <Breadcrumb title={'All Product'} />
        <section className="products-page">
          <div className="container">
            <ProductsFilter listCategory={listCategory} listMaterial={listMaterial} dataFilter={dataFilter} setDataFilter={setDataFilter} />
            <ProductsContent listProduct={listProduct} />
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Pagination current={dataFilter.page} pageSize={dataFilter.limit} total={totalCount} onChange={handleChangePagination} />
          </div>
        </section>
        <Footer />
      </Layout>
    </>
  )
}

export default Products
