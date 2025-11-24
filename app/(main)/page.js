import Link from 'next/link';
import { products } from './data/products';

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

export default function HomePage() {
  const featuredProducts = products.slice(0, 3); // Lấy 3 sản phẩm nổi bật

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="text-center mb-12 bg-indigo-50 p-10 rounded-2xl shadow-inner">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4">Chào mừng đến với CommerceBlog</h1>
        <p className="text-xl text-slate-600 mb-6">Nơi mua sắm tuyệt vời và những bài viết hữu ích!</p>
        <Link href="/product" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
          Khám phá Sản phẩm
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-2">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-2">Bài viết mới nhất</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <p className="text-slate-600">Đang tải các bài viết blog...</p>
          <Link href="/post" className="text-indigo-600 hover:text-indigo-800 mt-4 block font-medium">
            Xem tất cả bài viết &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}