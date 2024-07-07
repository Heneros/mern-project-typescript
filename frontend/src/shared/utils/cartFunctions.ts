

export const addDecimals = (num: number): string =>{
    return (Math.round(num * 100) / 100).toFixed(2)
}


interface CartItem {
    price: number;
    quantity: string;
}

interface CartState{
    cartItems: CartItem[];
    itemsPrice: string;
    totalPrice: string;
}



export const updateCart = (state: CartState): CartState =>{
 state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * Number(item.quantity), 0));
    state.totalPrice = addDecimals(Number(state.itemsPrice));
    localStorage.setItem('cart', JSON.stringify(state));
    return state;
}