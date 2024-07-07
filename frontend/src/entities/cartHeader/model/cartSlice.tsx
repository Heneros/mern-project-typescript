import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ICartItem, ICartState } from './types';
import { updateCart } from 'shared/utils/cartFunctions';

const savedCart = localStorage.getItem('cart');

const initialState: ICartState = savedCart
    ? (JSON.parse(savedCart) as ICartState)
    : { cartItems: [], itemsPrice: '0.00', totalPrice: '0.00' };

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<ICartItem>) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) {
                existItem.quantity = (
                    Number(existItem.quantity) + Number(item.quantity)
                ).toString();
            } else {
                state.cartItems.push(item);
            }
            updateCart(state);
        },
    },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
