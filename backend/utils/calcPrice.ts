import { IOrderItem } from '@/types/IOrderItem';

function addDecimals(num: number) {
    return (Math.round(num * 100) / 100).toFixed(2);
}

function calcPrice(orderItems: IOrderItem[]) {
    const itemsPrice = orderItems.reduce(
        (acc, item) => acc + (item.price * 100) / 100,
        0,
    );

    const taxPrice = 0.15 * itemsPrice;

    const totalPrice = itemsPrice + taxPrice;

    return {
        itemsPrice: addDecimals(itemsPrice),
        taxPrice: addDecimals(taxPrice),
        totalPrice: addDecimals(totalPrice),
    };
}
export { calcPrice, addDecimals };
