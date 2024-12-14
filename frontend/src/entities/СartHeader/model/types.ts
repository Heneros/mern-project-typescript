export interface ICartItem {
    _id: string;
    index?: string;
    title: string;
    preview: string;
    price: number;
    city: string;
}

export interface ICartState {
    cartItems: Array<ICartItem>;
    totalPrice: string;
}
