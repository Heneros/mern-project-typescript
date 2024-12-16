import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ICartItem, ICartState } from 'entities/СartHeader';

import { updateCart } from 'shared/utils/cartFunctions';

const savedCart = localStorage.getItem('cart');

const initialState: ICartState = savedCart
    ? (JSON.parse(savedCart) as ICartState)
    : {
          cartItems: [],
          taxPrice: 0,
          itemsTotal: 0,
          paymentMethod: 'Paypal',
          totalPrice: '0.00',
      };

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ICartItem>) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (!existItem) {
                state.cartItems.push(item);
                updateCart(state);
            }
        },

        clearCartItem: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.cartItems = state.cartItems.filter((item) => item._id !== id);
            updateCart(state);
        },
        clearCartItems: (state) => {
            state.cartItems = [];
            updateCart(state);
            // localStorage.setItem('cart', JSON.stringify(state));
        },
        updatePaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;

            updateCart(state);
        },
    },
});

export const { addToCart, clearCartItems, clearCartItem, updatePaymentMethod } =
    cartSlice.actions;
export default cartSlice.reducer;
