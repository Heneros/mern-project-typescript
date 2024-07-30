import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAppSelector } from 'shared/lib/store';
import './DropdownCart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { CartItemBook } from '../cartItemBook/CartItemBook';
import { Link } from 'react-router-dom';
import { ICartItem } from '../model/types';
import { formatPrice } from './../../../../../../shop-app/frontend/src/utils/helpers';

export const DropdownCart = () => {
    const itemsCart = useAppSelector((state) => state.cart);

    ///   console.log(itemsCart);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    return (
        <li className="dropdown">
            <Link to="#" onClick={toggleDropdown}>
                <i>
                    <FontAwesomeIcon icon={faCalendar} />
                </i>
                Schedule a visit
            </Link>
            {isOpen && (
                <div className="dropdown-menu">
                    {itemsCart.cartItems.length > 0 ? (
                        itemsCart.cartItems.map((item: ICartItem) => (
                            <React.Fragment key={item._id || item.index}>
                                <CartItemBook {...item} />
                            </React.Fragment>
                        ))
                    ) : (
                        <>Empty cart</>
                    )}
                    <span className="total-price">
                        Total Price: <b>{formatPrice(itemsCart.totalPrice)}</b>
                    </span>

                    <Link className="cart-link" to={'/cart'}>
                        Visit Cart
                    </Link>
                </div>
            )}
        </li>
    );
};
