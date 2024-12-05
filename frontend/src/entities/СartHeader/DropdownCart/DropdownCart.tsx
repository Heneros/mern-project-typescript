import React, { useEffect, useState } from 'react';
import './DropdownCart.css';
import { useAppSelector } from 'shared/lib/store';

import { CartItemBook } from '../CartItemBook/CartItemBook';
import { Link } from 'react-router-dom';
import { ICartItem } from '../model/types';

import { ScheduleBtn } from 'shared/ui/scheduleBtn';
import { formatPrice } from 'shared/utils/cartFunctions';

export const DropdownCart = () => {
    const itemsCart = useAppSelector((state) => state.cart);

    ///   console.log(itemsCart);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        // console.log(itemsCart);
        setIsOpen((prev) => !prev);
        // console.log(isOpen);
    };

    return (
        <li className="dropdown">
            <ScheduleBtn isInCart={true} onClick={toggleDropdown} />
            {/* <button onClick={toggleDropdown}>Schedule a visit</button> */}
            {isOpen && (
                <div className="dropdown-menu">
                    {itemsCart.cartItems ? (
                        itemsCart.cartItems.map((item: ICartItem) => (
                            <>
                                <CartItemBook {...item} />
                            </>
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
