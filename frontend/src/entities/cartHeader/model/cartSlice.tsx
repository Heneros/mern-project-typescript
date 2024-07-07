import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ICartItem, ICartState } from './types';
import { useState } from 'react';

const savedCart = localStorage.getItem('cart');

const initialState: ICartState = savedCart
    ? (JSON.parse(savedCart) as ICartState)
    : { cartItems: [] };

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItemCart(state, action: PayloadAction<ICartItem>) {
            state.cartItems.push(action.payload);
            localStorage.setItem('cart', JSON.stringify(useState));
        },
    },
});

export const { addItemCart } = cartSlice.actions;
export default cartSlice.reducer;
