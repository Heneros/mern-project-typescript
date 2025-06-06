jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
        paymentIntents: {
            create: jest.fn().mockResolvedValue({
                id: 'pi_mock_123',
                client_secret: 'mock_secret',
            }),
            retrieve: jest
                .fn()
                .mockResolvedValue({ id: 'pi_mock_123', status: 'succeeded' }),
        },
    }));
});
