import Link from 'next/link';
import { getProductById } from '../../data/products';

/**
 * Component hiển thị trang chi tiết sản phẩm.
 * QUAN TRỌNG: Phải là 'async' và cần 'await params' để lấy ID
 * vì params hiện là một Promise trong Next.js mới.
 */
export default async function ProductDetailPage({ params }) { 
  // 1. Giải nén ID từ params (cần await)
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // 2. Lấy dữ liệu sản phẩm
  const product = getProductById(id);

  // 3. Xử lý trường hợp không tìm thấy sản phẩm (404)
  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Không tìm thấy Sản phẩm</h1>
        <p className="text-lg text-slate-600">Sản phẩm với ID: `{id}` không tồn tại.</p>
        <Link href="/product" className="mt-6 inline-block text-indigo-600 hover:text-indigo-800 font-medium transition duration-300">
            &larr; Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  // 4. Hiển thị giao diện chi tiết
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Cột 1: Hình ảnh */}
          <div>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto rounded-lg shadow-xl object-cover"
              style={{ maxHeight: '500px' }}
            />
          </div>

          {/* Cột 2: Thông tin chi tiết */}
          <div>
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase mb-2">
              {product.category}
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{product.name}</h1>
            
            {/* Đánh giá */}
            <div className="flex items-center text-yellow-500 mb-4">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
              <span className="ml-2 text-slate-500 text-sm">({product.rating} sao)</span>
            </div>

            {/* Giá */}
            <p className="text-5xl font-bold text-indigo-600 my-6">
              {product.price.toLocaleString('vi-VN')}₫
            </p>

            {/* Mô tả sản phẩm */}
            <p className="text-slate-700 mb-6 leading-relaxed border-t pt-4">
                {product.description}
            </p>
            
            {/* Tình trạng tồn kho */}
            <div className="flex items-center mb-6 space-x-6">
                <span className={`text-sm font-medium p-2 rounded-lg ${
                    product.stock > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                }`}>
                    Kho: {product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng'}
                </span>
            </div>

            {/* Nút Thêm vào Giỏ hàng */}
            <button 
              disabled={product.stock === 0}
              className={`w-full py-3 rounded-xl text-lg font-semibold transition duration-300 ${
                product.stock > 0 
                  ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg' 
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? 'Thêm vào Giỏ hàng' : 'Hết hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}