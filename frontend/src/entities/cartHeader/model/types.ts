export interface ICartItem{
    readonly _id: string;
    readonly title: string;
    readonly image: string;
    readonly price: number;
    readonly url: string;
    quantity: string;
}

export interface ICartState {
    cartItems: Array<ICartItem>;
    itemsPrice: string;
    totalPrice: string;
}

