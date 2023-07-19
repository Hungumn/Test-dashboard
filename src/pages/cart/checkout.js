import Layout from 'src/layouts/Main';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import CheckoutStatus from 'src/Components/checkout-status';
import CheckoutItems from 'src/Components/checkout';
import { useEffect, useState } from 'react';
import { useAuth } from 'src/@core/hooks/use-auth'
import { useRouter } from 'next/router';

const CheckoutPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const user = useAuth().user;
  let loginBtn;
  useEffect(() => {
    console.log(user);
    if(!user.fullName) {
      loginBtn = (
        <div className="checkout__btns">
          <button className="btn btn--rounded btn--yellow">Log in</button>
          <button className="btn btn--rounded btn--border">Sign up</button>
        </div>
      );
    } else {
      setFullName(user.fullName);
      setAddress(user.add);
      setEmail(user.email);
      setPhoneNo(user.phoneNo);
    }
  }, []);

  const priceTotal = useSelector((state) => {
    const cartItems = state.cart.cartItems;
    let totalPrice = 0;
    if(cartItems.length > 0) {
      cartItems.map(item => totalPrice += item.price * item.count);
    }

    return totalPrice;
  });

  const redirectToHome = () => {
    router.push("/home-page");
  };

  const submitOrder = () => {};

  return (
    <Layout>
      <section className="cart">
        <div className="container">
          <div className="cart__intro">
            <h3 className="cart__title">Shipping and Payment</h3>
            <CheckoutStatus step="checkout" />
          </div>

          <div className="checkout-content">
            <div className="checkout__col-6">
              {loginBtn}

              <div className="block">
                <h3 className="block__title">Shipping information</h3>
                <form className="form">
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input className="form__input form__input--sm" value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
                    </div>

                    <div className="form__col">
                      <input className="form__input form__input--sm" value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder="Address" />
                    </div>
                  </div>
                  
                  <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input className="form__input form__input--sm" value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Fullname" />
                    </div>

                    <div className="form__col">
                      <input className="form__input form__input--sm" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} type="text" placeholder="Phone number" />
                    </div>
                  </div>
                  
                  {/* <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input className="form__input form__input--sm" type="text" placeholder="Last name" />
                    </div>

                    <div className="form__col">
                      <input className="form__input form__input--sm" type="text" placeholder="Postal code / ZIP" />
                    </div>
                  </div> */}

                  {/* <div className="form__input-row form__input-row--two">
                    <div className="form__col">
                      <input className="form__input form__input--sm" type="text" placeholder="Phone number" />
                    </div>

                    <div className="form__col">
                      <div className="select-wrapper select-form">
                        <select>
                          <option>Country</option>
                          <option value="Argentina">Argentina</option>
                        </select>
                      </div>
                    </div>
                  </div> */}
                </form>
              </div>
            </div>
            
            <div className="checkout__col-4">
              <div className="block">
                <h3 className="block__title">Payment method</h3>
                <ul className="round-options round-options--three">
                  <li className="round-item">
                    <img src="/images/logos/COD.jpg" alt="COD" title="COD" />
                  </li>
                  {/* <li className="round-item">
                    <img src="/images/logos/paypal.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/visa.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/mastercard.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/maestro.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/discover.png" alt="Paypal" />
                  </li>
                  <li className="round-item">
                    <img src="/images/logos/ideal-logo.svg" alt="Paypal" />
                  </li> */}
                </ul>
              </div>
              
              <div className="block">
                <h3 className="block__title">Delivery method</h3>
                <ul className="round-options round-options--two">
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/COD.jpg" alt="COD" />
                    <p>$1.00</p>
                  </li>
                  {/* <li className="round-item round-item--bg">
                    <img src="/images/logos/inpost.svg" alt="Paypal" />
                    <p>$20.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dpd.svg" alt="Paypal" />
                    <p>$12.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/dhl.svg" alt="Paypal" />
                    <p>$15.00</p>
                  </li>
                  <li className="round-item round-item--bg">
                    <img src="/images/logos/maestro.png" alt="Paypal" />
                    <p>$10.00</p>
                  </li> */}
                </ul>
              </div>
            </div>
            
            <div className="checkout__col-2">
              <div className="block">
                <h3 className="block__title">Your cart</h3>
                <CheckoutItems />
                
                <div className="checkout-total">
                  <p>Total cost</p>
                  <h3>${priceTotal}</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="cart-actions cart-actions--checkout">
            <a href="/cart" className="cart__btn-back"><i className="icon-left"></i> Back</a>
            <div className="cart-actions__items-wrapper">
              <button type="button" className="btn btn--rounded btn--border" onClick={redirectToHome}>
                Continue shopping
                </button>
              <button type="button" className="btn btn--rounded btn--yellow" onClick={submitOrder}>
                Proceed to payment
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
};

  
export default CheckoutPage