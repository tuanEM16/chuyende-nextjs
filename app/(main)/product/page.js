'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ProductService from '@/services/ProductService';




const ProductCard = ({ product }) => {
    const stockQty = Number(product?.qty ?? product?.total_qty ?? 0);
    const isOutOfStock = stockQty <= 0;

    const priceOriginal = Number(product?.price_buy ?? 0);
    const priceSale = Number(product?.price_sale ?? 0);
    const isSale = priceSale > 0 && priceOriginal > 0 && priceSale < priceOriginal;

    const discountPercent =
        isSale && priceOriginal > 0
            ? Math.round(((priceOriginal - priceSale) / priceOriginal) * 100)
            : 0;

    return (
        <div
            className={`group bg-white rounded-xl shadow-md transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full
      ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-xl hover:-translate-y-1'}`}
        >
            <div className="relative w-full pt-[75%] overflow-hidden bg-gray-50">
                <img
                    src={ProductService.getImageUrl(product?.thumbnail)}
                    alt={product?.name || 'product'}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                />

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                        <span className="border-2 border-white text-white px-4 py-1 font-bold tracking-widest text-sm uppercase">
                            HẾT HÀNG
                        </span>
                    </div>
                )}

                {!isOutOfStock && isSale && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded shadow-sm z-10">
                        -{discountPercent}%
                    </span>
                )}

                {!isOutOfStock && (
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <Link
                            href={`/product/${product?.id}`}
                            className="bg-white text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
                        >
                            Xem chi tiết
                        </Link>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-slate-400 mb-1 uppercase font-semibold">
                    {product?.category?.name || 'Sản phẩm'}
                </div>

                <h3
                    className="text-base font-bold text-slate-800 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-indigo-600 transition-colors"
                    title={product?.name}
                >
                    {product?.name}
                </h3>

                <div className="mt-auto pt-3 border-t border-slate-50">
                    {isSale ? (
                        <div className="flex flex-col">
                            <span className="text-lg font-extrabold text-red-600">
                                {priceSale.toLocaleString('vi-VN')}₫
                            </span>
                            <span className="text-sm text-slate-400 line-through">
                                {priceOriginal.toLocaleString('vi-VN')}₫
                            </span>
                        </div>
                    ) : (
                        <span className="text-lg font-extrabold text-slate-900">
                            {(Number.isFinite(priceOriginal) ? priceOriginal : 0).toLocaleString('vi-VN')}₫
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};




const ProductRow = ({ product }) => {
    const stockQty = Number(product?.qty ?? product?.total_qty ?? 0);
    const isOutOfStock = stockQty <= 0;

    const priceOriginal = Number(product?.price_buy ?? 0);
    const priceSale = Number(product?.price_sale ?? 0);
    const isSale = priceSale > 0 && priceOriginal > 0 && priceSale < priceOriginal;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex gap-4 items-center hover:shadow-sm transition">
            <div className="w-28 h-20 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                <img
                    src={ProductService.getImageUrl(product?.thumbnail)}
                    alt={product?.name || 'product'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
                    }}
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-400 uppercase font-semibold mb-1">
                    {product?.category?.name || 'Sản phẩm'}
                </div>

                <Link
                    href={`/product/${product?.id}`}
                    className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                    title={product?.name}
                >
                    {product?.name}
                </Link>

                <div className="mt-1 text-sm">
                    {isOutOfStock ? (
                        <span className="text-red-600 font-semibold">Hết hàng</span>
                    ) : (
                        <span className="text-green-600 font-semibold">Còn hàng: {stockQty}</span>
                    )}
                </div>
            </div>

            <div className="text-right">
                {isSale ? (
                    <>
                        <div className="text-red-600 font-extrabold">
                            {priceSale.toLocaleString('vi-VN')}₫
                        </div>
                        <div className="text-slate-400 line-through text-sm">
                            {priceOriginal.toLocaleString('vi-VN')}₫
                        </div>
                    </>
                ) : (
                    <div className="text-slate-900 font-extrabold">
                        {(Number.isFinite(priceOriginal) ? priceOriginal : 0).toLocaleString('vi-VN')}₫
                    </div>
                )}
            </div>

            <Link
                href={`/product/${product?.id}`}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700"
            >
                Xem
            </Link>
        </div>
    );
};




const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse h-[360px] border border-slate-100">
        <div className="w-full h-40 bg-slate-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
        <div className="h-6 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-6 bg-slate-200 rounded w-2/3 mb-6"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2 mt-auto"></div>
    </div>
);




export default function ProductPage() {
    const [raw, setRaw] = useState([]);
    const [loading, setLoading] = useState(true);


    const [serverPaging, setServerPaging] = useState(false);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);


    const [viewMode, setViewMode] = useState('grid'); // grid | list
    const [q, setQ] = useState('');
    const [category, setCategory] = useState('all');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortKey, setSortKey] = useState('newest'); // newest | price_asc | price_desc | name_asc | name_desc


    const pageSize = 12;
    const [localPage, setLocalPage] = useState(1);

    const normalizeProducts = (res) => {

        const paginateObj = res?.data?.data;
        if (paginateObj && Array.isArray(paginateObj.data)) {
            setServerPaging(true);
            setPage(Number(paginateObj.current_page || 1));
            setLastPage(Number(paginateObj.last_page || 1));
            return paginateObj.data;
        }


        if (Array.isArray(res?.data?.data)) {
            setServerPaging(false);
            return res.data.data;
        }


        if (Array.isArray(res?.data)) {
            setServerPaging(false);
            return res.data;
        }


        if (Array.isArray(res?.data?.data?.data)) {
            setServerPaging(true);
            return res.data.data.data;
        }

        setServerPaging(false);
        return [];
    };

    const fetchProducts = async (targetPage = 1) => {
        try {
            setLoading(true);



            const res = await ProductService.index({ page: targetPage });

            const dataSrc = normalizeProducts(res);
            setRaw(Array.isArray(dataSrc) ? dataSrc : []);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
            setRaw([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (serverPaging) fetchProducts(page);
        else fetchProducts(1);

    }, []);


    useEffect(() => {
        if (!serverPaging) return;
        fetchProducts(page);

    }, [page, serverPaging]);


    const categories = useMemo(() => {
        const set = new Set();
        raw.forEach((p) => {
            const name = p?.category?.name;
            if (name) set.add(name);
        });
        return ['all', ...Array.from(set)];
    }, [raw]);


    const filteredSorted = useMemo(() => {
        const keyword = q.trim().toLowerCase();
        const min = minPrice !== '' ? Number(minPrice) : null;
        const max = maxPrice !== '' ? Number(maxPrice) : null;

        const getDisplayPrice = (p) => {
            const buy = Number(p?.price_buy ?? 0);
            const sale = Number(p?.price_sale ?? 0);
            const isSale = sale > 0 && buy > 0 && sale < buy;
            return isSale ? sale : buy;
        };

        let arr = [...raw];


        if (keyword) {
            arr = arr.filter((p) => (p?.name || '').toLowerCase().includes(keyword));
        }


        if (category !== 'all') {
            arr = arr.filter((p) => (p?.category?.name || '') === category);
        }


        if (inStockOnly) {
            arr = arr.filter((p) => Number(p?.qty ?? p?.total_qty ?? 0) > 0);
        }


        if (min != null && Number.isFinite(min)) {
            arr = arr.filter((p) => getDisplayPrice(p) >= min);
        }
        if (max != null && Number.isFinite(max)) {
            arr = arr.filter((p) => getDisplayPrice(p) <= max);
        }


        arr.sort((a, b) => {
            const pa = getDisplayPrice(a);
            const pb = getDisplayPrice(b);

            switch (sortKey) {
                case 'price_asc':
                    return pa - pb;
                case 'price_desc':
                    return pb - pa;
                case 'name_asc':
                    return String(a?.name || '').localeCompare(String(b?.name || ''), 'vi');
                case 'name_desc':
                    return String(b?.name || '').localeCompare(String(a?.name || ''), 'vi');
                case 'newest':
                default: {
                    const ta = new Date(a?.created_at || 0).getTime();
                    const tb = new Date(b?.created_at || 0).getTime();
                    if (tb !== ta) return tb - ta;
                    return Number(b?.id || 0) - Number(a?.id || 0);
                }
            }
        });

        return arr;
    }, [raw, q, category, inStockOnly, minPrice, maxPrice, sortKey]);


    const totalLocalPages = useMemo(() => {
        if (serverPaging) return 1;
        return Math.max(1, Math.ceil(filteredSorted.length / pageSize));
    }, [filteredSorted.length, serverPaging]);

    useEffect(() => {
        if (serverPaging) return;

        setLocalPage(1);
    }, [q, category, inStockOnly, minPrice, maxPrice, sortKey, serverPaging]);

    const visibleProducts = useMemo(() => {
        if (serverPaging) return filteredSorted; // server: đang là 1 page từ backend
        const start = (localPage - 1) * pageSize;
        return filteredSorted.slice(start, start + pageSize);
    }, [filteredSorted, localPage, serverPaging]);


    const goPrev = () => {
        if (serverPaging) setPage((p) => Math.max(1, p - 1));
        else setLocalPage((p) => Math.max(1, p - 1));
    };
    const goNext = () => {
        if (serverPaging) setPage((p) => Math.min(lastPage, p + 1));
        else setLocalPage((p) => Math.min(totalLocalPages, p + 1));
    };

    const currentPage = serverPaging ? page : localPage;
    const totalPages = serverPaging ? lastPage : totalLocalPages;

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="bg-white shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-extrabold text-slate-900">Tất cả sản phẩm</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* ===== LEFT SIDEBAR ===== */}
                    <aside className="lg:col-span-3">
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm lg:sticky lg:top-24">
                            <div className="font-extrabold text-slate-900 mb-3">Bộ lọc</div>

                            {/* Search */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Tìm kiếm
                                </label>
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Nhập tên sản phẩm..."
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Danh mục
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                >
                                    {categories.map((c) => (
                                        <option key={c} value={c}>
                                            {c === 'all' ? 'Tất cả danh mục' : c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price range */}
                            <div className="mb-3">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Khoảng giá
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Từ"
                                        inputMode="numeric"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <input
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Đến"
                                        inputMode="numeric"
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* In stock */}
                            <label className="flex items-center gap-2 text-sm text-slate-700 select-none mb-4">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="w-4 h-4 accent-indigo-600"
                                />
                                Chỉ hiện còn hàng
                            </label>

                            {/* Sort */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Sắp xếp
                                </label>
                                <select
                                    value={sortKey}
                                    onChange={(e) => setSortKey(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price_asc">Giá tăng dần</option>
                                    <option value="price_desc">Giá giảm dần</option>
                                    <option value="name_asc">Tên A → Z</option>
                                    <option value="name_desc">Tên Z → A</option>
                                </select>
                            </div>

                            {/* Grid/List */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`w-1/2 px-4 py-2 rounded-xl font-bold border ${viewMode === 'grid'
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    Grid
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`w-1/2 px-4 py-2 rounded-xl font-bold border ${viewMode === 'list'
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    List
                                </button>
                            </div>

                            <div className="mt-3 text-xs text-slate-500">
                                Kết quả: <b>{filteredSorted.length}</b> sản phẩm
                            </div>
                        </div>
                    </aside>

                    {/* ===== RIGHT CONTENT ===== */}
                    <section className="lg:col-span-9">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : (
                            <>
                                {visibleProducts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
                                        <p className="text-xl font-medium text-slate-500">
                                            Không có sản phẩm phù hợp.
                                        </p>
                                    </div>
                                ) : viewMode === 'grid' ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {visibleProducts.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {visibleProducts.map((product) => (
                                            <ProductRow key={product.id} product={product} />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-10 flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={goPrev}
                                            disabled={currentPage <= 1}
                                            className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold disabled:opacity-50"
                                        >
                                            Trước
                                        </button>

                                        <div className="px-4 py-2 text-sm text-slate-700">
                                            Trang <b>{currentPage}</b> / <b>{totalPages}</b>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={goNext}
                                            disabled={currentPage >= totalPages}
                                            className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold disabled:opacity-50"
                                        >
                                            Sau
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
