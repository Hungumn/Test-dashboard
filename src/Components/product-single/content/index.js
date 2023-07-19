import { useState } from 'react';
import productsColors from 'src/utils/data/products-colors';
import productsSizes from 'src/utils/data/products-sizes';
import { useDispatch, useSelector } from 'react-redux';
import { some } from 'lodash';
import { addProduct } from 'store/reducers/cart';
import { toggleFavProduct } from 'store/reducers/user';
import { RootState } from 'store';
import CheckboxColor from 'src/Components/products-filter/form-builder/checkboxColor';


const Content = ({ product }) => {
	const dispatch = useDispatch();
	const [count, setCount] = useState(1);
	const [color, setColor] = useState('');
	const [itemSize, setItemSize] = useState('');

	const onColorSet = (e) => setColor(e);
	const onSelectChange = (e) => setItemSize(e.target.value);

	const { favProducts } = useSelector((state) => state.user);
	const isFavourite = some(favProducts, (productId) => productId === product.id);

	const toggleFav = () => {
		dispatch(
			toggleFavProduct({
				id: product.id,
			})
		);
	};

	const addToCart = () => {
		const productToSave = {
			id: product.productId,
			name: product.productName,
			thumb: product.images,
			price: product.price,
			material: product.productTechnicals.map(item => item.materialName).join(","),
			count: count,
		};

		const productStore = {
			count,
			product: productToSave,
		};

		dispatch(addProduct(productStore));
	};

	return (
		<section className="product-content">
			<div className="product-content__intro">
				<h5 className="product__id">
					Product ID:<br></br>
					{product.productId}
				</h5>
				<span className="product-on-sale">Sale</span>
				<h2 className="product__name">{product.productName}</h2>

				<div className="product__prices">
					<h4>${product.price}</h4>
					{product.discount && <span>${product.price}</span>}
				</div>
			</div>

			<div className="product-content__filters">
				<div className="product-filter-item">
					<h5>Description & Details:</h5>
					{product.description}
					{product.productTechnicals.map(item => (
						<div>{item.techName} of {item.materialName}: {item.parameter} ({item.unit})</div>
					))}
				</div>				
				<div className="product-filter-item">
					<h5>Quantity:</h5>
					<div className="quantity-buttons">
						<div className="quantity-button">
							<button
								type="button"
								onClick={() => {
									if (count < 1) {
										return;
									} else {
										setCount(count - 1);
									}
								}}
								className="quantity-button__btn"
							>
								-
							</button>
							<span>{count}</span>
							<button type="button" onClick={() => setCount(count + 1)} className="quantity-button__btn">
								+
							</button>
						</div>

						<button
							type="submit"
							onClick={() => {
								if (count > 0) {
									addToCart();
								} else {
									return;
								}
							}}
							className="btn btn--rounded btn--yellow"
						>
							Add to cart
						</button>
						<button type="button" onClick={toggleFav} className={`btn-heart ${isFavourite ? 'btn-heart--active' : ''}`}>
							<i className="icon-heart"></i>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Content;
