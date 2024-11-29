interface OrderDocument {
    paymentResult: {
        id: string;
        status: string;
        update_time: string;
    };
    [key: string]: any;
}
