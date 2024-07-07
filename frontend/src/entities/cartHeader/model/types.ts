export interface ICartItem{
    readonly title: string;
    readonly image: string;
    readonly price: number;
    readonly url: string;
    readonly quantity: string;
}

export interface ICartState {
  cartItems: Array<ICartItem>;
}

