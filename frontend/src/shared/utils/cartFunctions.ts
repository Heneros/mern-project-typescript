export const addDecimals = (num: number): string => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

interface CartItem {
    price: number;
}

interface CartState {
    cartItems: CartItem[];
    totalPrice: string;
    // price: number;
}
export const formatPrice = (number: any) => {
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(number / 1);
};

export const updateCart = (state: CartState): CartState => {
    const total = state.cartItems.reduce((acc, item) => acc + item.price, 0);
    state.totalPrice = addDecimals(total);
    localStorage.setItem('cart', JSON.stringify(state));
    return state;
};
