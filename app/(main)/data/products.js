// Dữ liệu giả định cho sản phẩm
export const products = [
    {
        id: '1',
        name: 'Áo thun cơ bản',
        price: 250000,
        category: 'Thời trang',
        description: 'Áo thun cotton 100% co giãn 4 chiều, màu trắng tinh khiết, phù hợp cho mọi hoạt động.',
        imageUrl: '/images/1.jpg',
        rating: 4.5,
        stock: 50,
    },
    {
        id: '2',
        name: 'Máy ảnh Mirrorless X100',
        price: 25000000,
        category: 'Thiết bị điện tử',
        description: 'Máy ảnh kỹ thuật số cao cấp với cảm biến full-frame, quay video 4K sắc nét.',
        imageUrl: '/images/2.jpg',
        rating: 4.8,
        stock: 15,
    },
    {
        id: '3',
        name: 'Sách: Lập trình hiện đại',
        price: 180000,
        category: 'Sách',
        description: 'Tuyển tập các kỹ thuật và mô hình lập trình mới nhất trong năm 2025.',
        imageUrl: '/images/3.jpg',
        rating: 4.2,
        stock: 120,
    },
];

// Hàm tìm sản phẩm theo ID
export function getProductById(id) {
    return products.find(p => p.id === id);
}