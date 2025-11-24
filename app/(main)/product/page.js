import Link from 'next/link';
import { products } from '../data/products';

const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="p-4">
            <h3 className="text-xl font-semibold text-slate-800 truncate">{product.name}</h3>
            <p className="text-indigo-600 font-bold my-2 text-2xl">
                {product.price.toLocaleString('vi-VN')}₫
            </p>
            <div className="flex items-center text-sm text-yellow-500 mb-4">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
                <span className="ml-2 text-slate-500">({product.rating})</span>
            </div>
            <Link href={`/product/${product.id}`} className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 font-medium">
                Xem chi tiết
            </Link>
        </div>
    </div>
);

export default function ProductPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-8 border-b pb-3">Tất cả Sản phẩm</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {products.length === 0 && (
                <div className="text-center p-10 bg-slate-100 rounded-xl mt-8">
                    <p className="text-xl text-slate-600">Hiện chưa có sản phẩm nào được hiển thị.</p>
                </div>
            )}
        </div>
    );
}