function filterProducts(products, filters) {
    return products.filter(function (product) {
        if (filters.category && product.category !== filters.category) {
            return false;
        }
        if (filters.priceRange &&
            (product.price < filters.priceRange[0] ||
                product.price > filters.priceRange[1])) {
            return false;
        }
        if (filters.inStockOnly && !product.inStock) {
            return false;
        }
        if (filters.minRating !== undefined &&
            (product.rating === undefined || product.rating < filters.minRating)) {
            return false;
        }
        return true;
    });
}
var catalog = [
    {
        id: 1,
        name: 'iPhone',
        category: 'electronics',
        price: 999,
        inStock: true,
        rating: 5,
    },
    {
        id: 2,
        name: 'Jeans',
        category: 'clothing',
        price: 50,
        inStock: false,
        rating: 4,
    },
    { id: 3, name: 'Book', category: 'books', price: 20, inStock: true },
];
var filtered = filterProducts(catalog, {
    category: 'electronics',
    priceRange: [500, 1000],
    inStockOnly: true,
    minRating: 4,
});
console.log(filtered);
