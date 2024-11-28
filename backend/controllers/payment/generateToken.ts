import axios from 'axios';

const generateAccessToken = async () => {
    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

    const auth = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
    ).toString('base64');

    try {
        const response = await axios.post(
            'https://api.sandbox.paypal.com/v1/oauth2/token',
            'grant_type_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            },
        );
        return response.data.access_token;
    } catch (error) {
        throw new Error('Failed to generate PayPal access token');
    }
};

export default generateAccessToken;
