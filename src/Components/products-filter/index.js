import { useState, useEffect } from 'react';
import Checkbox from './form-builder/checkbox';
import Slider from 'rc-slider';

// data
import productsTypes from 'src/utils/data/products-types';
import productsColors from 'src/utils/data/products-colors';
import productsSizes from 'src/utils/data/products-sizes';
import CheckboxColor from 'src/Components/products-filter/form-builder/checkboxColor/index';

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const ProductsFilter = ({ listCategory, listMaterial }) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const addQueryParams = () => {
    // query params changes
  }

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
          <div className="products-filter__block__content">
            {listCategory.map(type => (
              <Checkbox 
                key={type.categoryId} 
                name="category" 
                label={type.categoryName} 
              />
            ))}
          </div>
        </div>

        <div className="products-filter__block">
          <button type="button">Price</button>
          <div className="products-filter__block__content">
            <Range min={0} max={20} defaultValue={[3, 10]} tipFormatter={value => `${value}%`} />
          </div>
        </div>
        
        {/* <div className="products-filter__block">
          <button type="button">Size</button>
          <div className="products-filter__block__content checkbox-square-wrapper">
            {productsSizes.map(type => (
              <Checkbox 
                type="square" 
                key={type.id} 
                name="product-size" 
                label={type.label} />
            ))}
          </div>
        </div> */}

        <div className="products-filter__block">
          <button type="button">Material type</button>
          <div className="products-filter__block__content">
            {listMaterial.map(type => (
              <Checkbox 
                key={type.materialId} 
                name="material" 
                label={type.materialName} 
              />
            ))}
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
  