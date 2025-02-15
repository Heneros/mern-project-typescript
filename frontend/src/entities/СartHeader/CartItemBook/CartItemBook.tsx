import React from 'react';
import { Link } from 'react-router-dom';

import './CartItem.css';
import { ICartItem } from 'entities/СartHeader';
import { formatPrice } from 'shared/utils/cartFunctions';

export const CartItemBook = ({ _id, title, preview, price }: ICartItem) => {
    return (
        <>
            <div className="cart-component">
                <span className="title">
                    <Link className="link" to={`/post/${_id}`}>
                        {title}
                    </Link>
                </span>
                <img src={preview} alt="preview img" />
                <div className="bottom">
                    <b>{formatPrice(price)}</b>
                </div>
            </div>
        </>
    );
};
