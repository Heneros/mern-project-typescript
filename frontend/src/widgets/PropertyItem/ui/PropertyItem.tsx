import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from 'shared/lib/store';
import { PostInfo } from 'shared/types';
import { addToCart, ICartItem } from 'entities/cartHeader';
import { useGetSinglePropertyQuery } from 'features/properties/propertiesApiSlice';
import { formatPrice } from 'shared/utils/cartFunctions';

export const PropertyItem: React.FC<PostInfo> = ({
    _id,
    title,
    price,
    preview,
    category,
    bedrooms,
    bathrooms,
    area,
    floor,
}) => {
    const dispatch = useAppDispatch();
    const { data, isLoading, error } = useGetSinglePropertyQuery(_id);
    // console.log(data);
    // const { _id, title, image } = data.propertyPage;
    // console.log(_id);
    const addToCartHandler = () => {
        // if (propertyPage) {
        const cartItem: ICartItem = {
            _id: _id,
            title: title,
            preview: preview,
            price: price,
        };
        ///  console.log(cartItem);
        dispatch(addToCart(cartItem));
        // } else {
        //     console.log('123');
        // }
    };

    return (
        <div
            key={_id}
            className={`col-lg-4 col-md-6 align-self-center mb-30 properties-items col-md-6 ${category.slice(0, 3).toLocaleLowerCase()} `}
        >
            <div className="item">
                <Link to={`/post/${_id}`}>
                    <img src={preview} alt="preview image of villa" />
                </Link>
                <span className="category">{category}</span>
                <h6>{formatPrice(price)} </h6>
                <h4>
                    <Link to={`/post/${_id}`}>{title}</Link>
                </h4>
                <ul>
                    <li>
                        Bedrooms: <span>{bedrooms}</span>
                    </li>
                    <li>
                        Bathrooms: <span>{bathrooms}</span>
                    </li>
                    <li>
                        Area: <span>{area} m2</span>
                    </li>
                    <li>
                        Floor: <span>{floor} </span>
                    </li>
                    <li>
                        Parking: <span>6 spots</span>
                    </li>
                </ul>
                <div className="main-button">
                    <Link to="#" onClick={addToCartHandler}>
                        Schedule a visit
                    </Link>
                </div>
            </div>
        </div>
    );
};
