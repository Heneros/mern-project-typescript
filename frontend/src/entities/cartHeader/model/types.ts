export interface ICartItem{
    _id: string;
    title: string;
    preview: string;
    price: number;
}

export interface ICartState {
    cartItems: Array<ICartItem>;
    totalPrice: string;
}

