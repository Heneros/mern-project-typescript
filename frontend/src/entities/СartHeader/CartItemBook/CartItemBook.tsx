import { Link } from 'react-router-dom';

import './CartItem.module.css';
import { formatPrice } from 'shared/utils/cartFunctions';
import { ICartItem } from 'entities/СartHeader';

export const CartItemBook = ({ _id, title, preview, price }: ICartItem) => {
    return (
        <>
            <div className="cart-component">
                <span className="title">
                    <Link className="link" to={`/properties/${_id}`}>
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
