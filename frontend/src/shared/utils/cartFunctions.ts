import { ICartItem } from 'entities/СartHeader';

export const addDecimals = (num: number): string => {
    return (Math.round(num * 100) / 100).toFixed(2);
};


interface CartState {
    cartItems: ICartItem[];
    itemsTotal: number;
    taxPrice: number;
    totalPrice: string;
    paymentMethod?: string;
}
export const formatPrice = (number: any) => {
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(number / 1);
};

// export const updateCart = (state: CartState): CartState => {
export const updateCart = (state: CartState) => {
    state.itemsTotal = state.cartItems.reduce(
        (acc, item) => acc + Number(item.price || 0),
        0,
    );

    state.taxPrice = Number((0.15 * state.itemsTotal).toFixed(2));
    state.totalPrice = addDecimals(state.itemsTotal + state.taxPrice);

    localStorage.setItem('cart', JSON.stringify(state));
    return state;
};
