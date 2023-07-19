import { useState, useEffect } from 'react';
import Checkbox from './form-builder/checkbox';
import { Select } from 'antd';
import Slider from 'rc-slider';

// data
import productsTypes from 'src/utils/data/products-types';
import productsColors from 'src/utils/data/products-colors';
import productsSizes from 'src/utils/data/products-sizes';
import CheckboxColor from 'src/Components/products-filter/form-builder/checkboxColor/index';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const ProductsFilter = ({ listCategory, listMaterial, dataFilter, setDataFilter }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const addQueryParams = () => {
    // query params changes
}

  const handleChangeCategory = (e) => {
    setDataFilter({...dataFilter, page: 1, categories: e});
  };

  const handleChangeMaterial = (e) => {
    setDataFilter({...dataFilter, page: 1, materials: e});
  };

  const handleChangePrice = (e) => {
    setDataFilter({...dataFilter, page: 1, minPrice: e[0], maxPrice: e[1]});
  };

  return (
    <form className="products-filter" onChange={addQueryParams}>
      <button type="button"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className={`products-filter__menu-btn ${filtersOpen ? 'products-filter__menu-btn--active' : ''}`}>
          Add Filter <i className="icon-down-open"></i>
      </button>

      <div className={`products-filter__wrapper ${filtersOpen ? 'products-filter__wrapper--open' : ''}`}>
        <div className="products-filter__block">
          <button type="button">Product type</button>
          <div style={{overflow: 'auto'}}>
            <div className="products-filter__block__content" style={{maxHeight: '376px'}}>
              <Select
                mode="multiple"
                style={{ width: '100%'}}
                placeholder="Filter by category"
                onChange={handleChangeCategory}
                allowClear
                options={listCategory.map(i => ({label: i.categoryName, value: i.categoryId}))}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
            </div>
          </div>
        </div>

        <div className="products-filter__block">
          <button type="button">Price</button>
          <div className="products-filter__block__content">
            <Range min={50} max={200} defaultValue={[50, 100]} tipFormatter={value => `${value}$`} onChange={handleChangePrice} />
          </div>
        </div>
        <div className="products-filter__block">
          <button type="button">Material type</button>
          <div className="products-filter__block__content">
            <Select
                mode="multiple"
                style={{ width: '100%'}}
                allowClear
                placeholder="Filter by material"
                onChange={handleChangeMaterial}
                options={listMaterial.map(i => ({label: i.materialName, value: i.materialId}))}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              />
          </div>
        </div>

        <div className="products-filter__block">
          <button type="button">Color</button>
          <div className="products-filter__block__content">
            <div className="checkbox-color-wrapper">
              {productsColors.map(type => (
                <CheckboxColor key={type.id} valueName={type.color} name="product-color" color={type.color} />
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-submit btn--rounded btn--yellow">Apply</button>
      </div>
    </form>
  )
}

export default ProductsFilter
