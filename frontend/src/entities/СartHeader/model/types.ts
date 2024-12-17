export interface ICartItem {
    _id?: string;
    property: string;
    index?: string;
    title: string;
    preview: string;
    price: number;
    city: string;
    // qty: number;
}

export interface ICartState {
    cartItems: Array<ICartItem>;
    totalPrice: string;
    itemsTotal: number;

    paymentMethod: string;
    taxPrice: number;
}
