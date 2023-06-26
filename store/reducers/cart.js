import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const indexSameProduct = (state, action) => {
  const sameProduct = product =>
    product.id === action.id && product.color === action.color && product.size === action.size

  return state.cartItems.findIndex(sameProduct)
}
const initialState = {
  cartItems: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const cartItems = state.cartItems

      // find index of product
      const index = indexSameProduct(state, action.payload.product)

      if (index !== -1) {
        cartItems[index].count += action.payload.count
        return
      }

      return {
        ...state,
        cartItems: [...state.cartItems, action.payload.product]
      }
    },
    removeProduct(state, action) {
      // find index of product
      state.cartItems.splice(indexSameProduct(state, action.payload), 1)
    },
    setCount(state, action) {
      // find index and add new count on product count
      const indexItem = indexSameProduct(state, action.payload.product)
      state.cartItems[indexItem].count = action.payload.count
    }
  }
})

export const { addProduct, removeProduct, setCount } = cartSlice.actions
export default cartSlice.reducer
