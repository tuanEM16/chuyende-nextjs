'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Icon = ({ path, size = 20, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
);

// Đã sửa lại đường dẫn SVG chuẩn cho SearchIcon
const SearchIcon = (props) => <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" {...props} />;

const PlusIcon = (props) => <Icon path={["M12 5v14","M5 12h14"]} {...props} />;
const EditIcon = (props) => <Icon path={["M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"]} {...props} />;
const Trash2Icon = (props) => <Icon path={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M10 11v6","M14 11v6","M15 6V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2"]} {...props} />;
const EyeIcon = (props) => <Icon path={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} {...props} />;
// --- END ICONS ---// --- END ICONS ---

export default function AdminProductPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cấu hình URL ảnh backend
    const IMAGE_BASE_URL = 'http://127.0.0.1:8000/images/product/';

    // Hàm gọi API lấy dữ liệu
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://127.0.0.1:8000/api/product');
            if (res.data.success) {
                // Laravel paginate trả về data trong cấu trúc: res.data.data.data
                // Nếu bạn dùng get() thường thì là: res.data.data
                setProducts(res.data.data.data || res.data.data || []);
            }
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
            alert("Không thể tải danh sách sản phẩm.");
        } finally {
            setLoading(false);
        }
    };

    // Gọi API khi mới vào trang
    useEffect(() => {
        fetchProducts();
    }, []);

    // Xử lý xóa sản phẩm (GỌI API THẬT)
    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID: ${id}?`)) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/product/${id}`);
                // Xóa thành công thì load lại danh sách hoặc lọc bỏ item đó
                setProducts(products.filter(p => p.id !== id));
                alert("Đã xóa thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Xóa thất bại!");
            }
        }
    };

    // Lọc sản phẩm ở phía Client (Tạm thời)
    const filteredProducts = useMemo(() => {
        const lowerCaseSearch = searchTerm.toLowerCase();
        return products.filter(product =>
            product.name?.toLowerCase().includes(lowerCaseSearch)
        );
    }, [searchTerm, products]);

    // Helper hiển thị hình ảnh an toàn
    const getImageUrl = (filename) => {
        if (!filename) return "https://via.placeholder.com/150";
        if (filename.startsWith('http')) return filename; // Nếu là link online
        return IMAGE_BASE_URL + filename; // Nếu là tên file trên server
    };

    return (
        <div className="space-y-8 p-6">
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
                        placeholder="Tìm kiếm sản phẩm theo tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Bảng danh sách */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Sản phẩm</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Danh mục (ID)</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Giá bán</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-12 w-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={getImageUrl(product.thumbnail)}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null; // Chặn lặp vô hạn nếu ảnh thay thế cũng lỗi
                                                            e.target.src = "https://placehold.co/150?text=No+Image";
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                                    <div className="text-xs text-slate-500">ID: {product.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {/* Tạm thời hiện ID, nếu muốn hiện tên danh mục phải join bảng ở backend */}
                                            ID: {product.category_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                                            {Number(product.price_buy).toLocaleString('vi-VN')}₫
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {product.status === 1 ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Hiện</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Ẩn</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <div className="flex justify-center space-x-3">
                                                <Link href={`/admin/product/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 transition" title="Chỉnh sửa">
                                                    <EditIcon size={18} />
                                                </Link>
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
                                        Không tìm thấy sản phẩm nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}