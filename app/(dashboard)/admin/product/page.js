'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { products as mockProducts } from '../../../(main)/data/products';

// --- INLINE SVG COMPONENTS ---
const Icon = ({ path, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);
const SearchIcon = (props) => <Icon path={["M10 10m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0","l1 1"]} {...props} />;
const PlusIcon = (props) => <Icon path={["M12 5v14","M5 12h14"]} {...props} />;
const EditIcon = (props) => <Icon path={["M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"]} {...props} />;
const Trash2Icon = (props) => <Icon path={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M10 11v6","M14 11v6","M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"]} {...props} />;
const EyeIcon = (props) => <Icon path={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} {...props} />;
// --- END ICONS ---

export default function AdminProductPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState(mockProducts);

    // Lọc sản phẩm theo tên hoặc danh mục
    const filteredProducts = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(lowerCaseSearch) ||
            product.category.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchTerm, products]);

    // Xử lý xóa sản phẩm
    const handleDelete = (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID: ${id}?`)) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    // Helper hiển thị trạng thái tồn kho
    const getStockStatus = (stock) => {
        if (stock === 0) return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Hết hàng</span>;
        if (stock < 10) return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Sắp hết ({stock})</span>;
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Còn hàng ({stock})</span>;
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Quản lý Sản phẩm</h1>
                <Link 
                    href="/admin/product/add" 
                    className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md w-full sm:w-auto"
                >
                    <PlusIcon size={20} />
                    <span>Thêm Sản phẩm</span>
                </Link>
            </div>
            
            {/* Thanh tìm kiếm */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="text-slate-400" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm theo tên, danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                    />
                </div>
            </div>

            {/* Bảng danh sách */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sản phẩm</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Danh mục</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                    <img className="h-full w-full object-cover" src={product.imageUrl} alt={product.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                                    <div className="text-xs text-slate-500">ID: {product.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                                            {product.price.toLocaleString('vi-VN')}₫
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStockStatus(product.stock)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-3">
                                                <Link href={`/product/${product.id}`} target="_blank" className="text-slate-400 hover:text-indigo-600 transition" title="Xem trên web">
                                                    <EyeIcon size={18} />
                                                </Link>
                                                <button className="text-indigo-600 hover:text-indigo-900 transition" title="Chỉnh sửa">
                                                    <EditIcon size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product.id)} 
                                                    className="text-red-400 hover:text-red-600 transition"
                                                    title="Xóa"
                                                >
                                                    <Trash2Icon size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        Không tìm thấy sản phẩm nào phù hợp với từ khóa "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Tĩnh) */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-700">
                                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredProducts.length}</span> trong số <span className="font-medium">{filteredProducts.length}</span> kết quả
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">Trước</button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-indigo-600 hover:bg-slate-50">1</button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">2</button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50">3</button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50">Sau</button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}