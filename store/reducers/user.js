import { remove } from 'lodash'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  user: {
    name: 'Lucas Pulliese',
  },
  favProducts: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleFavProduct(state, action) {
      const index = state.favProducts.includes(action.payload.id)

      if (!index) {
        state.favProducts.push(action.payload.id)

        return
      }

      remove(state.favProducts, id => id === action.payload.id)
    },
    setUserLogged(state, action) {
      const index = state.favProducts.includes(action.payload.id)

      if (!index) {
        state.favProducts.push(action.payload.id)

        return {
          ...state,
          favProducts: state.favProducts
        }
      }

      remove(state.favProducts, id => id === action.payload.id)

      return {
        ...state,
        favProducts: state.favProducts
      }
    }
  }
})

export const { toggleFavProduct, setUserLogged } = userSlice.actions
export default userSlice.reducer
