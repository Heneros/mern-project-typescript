import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAppSelector } from 'shared/lib/store';
import './DropdownCart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { CartItemBook } from '../cartItemBook/CartItemBook';
import { Link } from 'react-router-dom';
import { ICartItem } from '../model/types';

export const DropdownCart = () => {
    const itemsCart = useAppSelector((state) => state.cart);

    //console.log(itemsCart);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    return (
        <li className="dropdown">
            <Link to="#" onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faCalendar} />
                Schedule a visit
            </Link>
            {isOpen && (
                <div className="dropdown-menu">
                    {itemsCart.cartItems.length > 0 ? (
                        itemsCart.cartItems.map((item: ICartItem) => (
                            <>
                                <CartItemBook key={item._id} {...item} />
                            </>
                        ))
                    ) : (
                        <>Empty cart</>
                    )}
                </div>
            )}
        </li>
    );
};
