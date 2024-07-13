import React from 'react';
import { Link } from 'react-router-dom';
import { ICartItem } from '../model/types';
import './CartItem.css';
import { formatPrice } from 'shared/utils/cartFunctions';

export const CartItemBook = ({ _id, title, preview, price }: ICartItem) => {
    return (
        <>
            <hr />
            <div className="cart-component">
                <span className="title">{title}</span>
                <img src={preview} alt="preview img" />
                <div className="bottom">
                    <b>{formatPrice(price)}</b>
                </div>
            </div>
         
        </>
    );
};
