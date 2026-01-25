'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductService from '@/services/ProductService';
import BannerService from '@/services/BannerService';
import PostService from '@/services/PostService';


const BannerSlider = ({ banners = [] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!Array.isArray(banners) || banners.length <= 1) return;

    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(t);
  }, [banners.length]);

  if (!banners.length) return null;

  const prev = (e) => {
    e?.stopPropagation?.();
    setIndex((i) => (i - 1 + banners.length) % banners.length);
  };

  const next = (e) => {
    e?.stopPropagation?.();
    setIndex((i) => (i + 1) % banners.length);
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-slate-900 mb-12">
      {/* track */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((b) => (
          <div key={b.id} className="relative w-full h-full flex-shrink-0">
            <img
              src={BannerService.getImageUrl(b.image)}
              alt={b.name || 'banner'}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/1600x600?text=Banner';
              }}
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex items-center justify-center text-center px-4">
              <div className="max-w-4xl">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                  {b.name}
                </h2>

                {b.description && (
                  <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto font-light drop-shadow-md">
                    {b.description}
                  </p>
                )}

                {b.link && (
                  <Link
                    href={b.link}
                    className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl"
                  >
                    Khám Phá Ngay
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur flex items-center justify-center"
            aria-label="Prev"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur flex items-center justify-center"
            aria-label="Next"
          >
            ›
          </button>

          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-3 rounded-full transition-all duration-300 ${i === index ? 'bg-indigo-500 w-8' : 'bg-white/50 hover:bg-white w-3'
                  }`}
                aria-label={`Go ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};


const stripHtml = (html = '') => String(html).replace(/<[^>]+>/g, '').trim();

const PostSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
    <div className="h-44 bg-slate-200" />
    <div className="p-4">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-3" />
      <div className="h-6 bg-slate-200 rounded w-full mb-2" />
      <div className="h-4 bg-slate-200 rounded w-5/6" />
    </div>
  </div>
);

const PostCard = ({ post }) => {
  const excerpt = stripHtml(post?.description || post?.content || '').slice(0, 120);

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative h-44 bg-slate-100">
        <img
          src={PostService.getImageUrl(post?.image)}
          alt={post?.title || 'post'}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image')}
        />
      </div>

      <div className="p-4">
        <p className="text-xs text-slate-500 mb-2">
          {post?.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : ''}
        </p>

        <Link
          href={`/blog/${post?.slug || post?.id}`}
          className="font-bold text-slate-900 line-clamp-2 hover:text-indigo-600"
          title={post?.title}
        >
          {post?.title}
        </Link>

        <p className="text-sm text-slate-600 mt-2 line-clamp-3">{excerpt || '...'}</p>

        <div className="mt-4">
          <Link href={`/blog/${post?.slug || post?.id}`} className="text-indigo-600 font-semibold hover:underline">
            Xem chi tiết →
          </Link>
        </div>
      </div>
    </div>
  );
};


const ProductCard = ({ product }) => {
  const priceBuy = Number(product?.price_buy ?? 0);
  const priceSale = product?.price_sale ? Number(product.price_sale) : null;
  const saleOk = priceSale && priceSale > 0 && priceBuy > 0 && priceSale < priceBuy;

  return (
    <div className="group bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="relative w-full pt-[75%] overflow-hidden bg-gray-100">
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
            New
          </span>
          {saleOk && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
              -{Math.round(((priceBuy - priceSale) / priceBuy) * 100)}%
            </span>
          )}
        </div>

        <img
          src={ProductService.getImageUrl(product?.thumbnail)}
          alt={product?.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x300?text=No+Image';
          }}
        />

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            href={`/product/${product.id}`}
            className="bg-white/90 text-slate-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
          >
            Xem Ngay
          </Link>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-semibold">
          {product?.category?.name || 'Sản phẩm'}
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors" title={product?.name}>
          {product?.name}
        </h3>

        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div>
            {saleOk ? (
              <>
                <span className="block text-xl font-extrabold text-red-600">{priceSale.toLocaleString('vi-VN')}₫</span>
                <span className="text-sm text-slate-400 line-through">{priceBuy.toLocaleString('vi-VN')}₫</span>
              </>
            ) : (
              <span className="block text-xl font-extrabold text-slate-900">{priceBuy.toLocaleString('vi-VN')}₫</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 animate-pulse h-[380px] border border-slate-100">
    <div className="w-full h-48 bg-slate-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
    <div className="h-6 bg-slate-200 rounded w-full mb-2"></div>
    <div className="h-6 bg-slate-200 rounded w-2/3 mb-6"></div>
    <div className="h-8 bg-slate-200 rounded w-1/2 mt-auto"></div>
  </div>
);

export default function HomePage() {
  const [catList, setCatList] = useState([]);
  const [activeCat, setActiveCat] = useState('');
  const [catMap, setCatMap] = useState({});
  const [newProducts, setNewProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]); // ✅ đúng chỗ
  const [loading, setLoading] = useState(true);

  const normalizeProducts = (res) => {
    let arr = [];
    if (res?.data && Array.isArray(res.data.data)) arr = res.data.data;
    else if (res?.data?.data && Array.isArray(res.data.data.data)) arr = res.data.data.data;
    else if (res?.data && Array.isArray(res.data)) arr = res.data;
    return arr;
  };

  const isSale = (p) => {
    const buy = Number(p?.price_buy ?? 0);
    const sale = Number(p?.price_sale ?? 0);
    return sale > 0 && buy > 0 && sale < buy;
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);


        const [bannerRes, productRes, postRes] = await Promise.all([
          BannerService.index(),
          ProductService.index(),
          PostService.index({ page: 1 }),
        ]);


        const postPayload = postRes?.data?.data;
        const postArray = Array.isArray(postPayload?.data)
          ? postPayload.data
          : Array.isArray(postPayload)
            ? postPayload
            : [];
        setLatestPosts(postArray.slice(0, 4));


        const bannerData = bannerRes?.data?.data || bannerRes?.data || [];
        setBanners((bannerData || []).filter((b) => b.position === 'slideshow'));


        const productsArray = normalizeProducts(productRes);
        const getStock = (p) => Number(p?.qty ?? p?.total_qty ?? 0);
        const inStockProducts = productsArray.filter((p) => getStock(p) > 0);

        // ====== PRODUCTS THEO DANH MỤC ======
        const map = {};
        for (const p of inStockProducts) {
          const catName = p?.category?.name || 'Khác';
          if (!map[catName]) map[catName] = [];
          map[catName].push(p);
        }

        // sort mỗi danh mục theo newest (created_at/id)
        Object.keys(map).forEach((k) => {
          map[k] = map[k].sort((a, b) => {
            const ta = new Date(a?.created_at || 0).getTime();
            const tb = new Date(b?.created_at || 0).getTime();
            if (tb !== ta) return tb - ta;
            return Number(b?.id || 0) - Number(a?.id || 0);
          });
        });

        const topCats = Object.keys(map)
          .filter((k) => k !== 'Khác')
          .sort((a, b) => (map[b]?.length || 0) - (map[a]?.length || 0))
          .slice(0, 4);

        // fallback nếu không có danh mục
        if (topCats.length === 0 && Object.keys(map).length > 0) {
          topCats.push(Object.keys(map)[0]);
        }

        setCatMap(map);
        setCatList(topCats);
        setActiveCat((prev) => prev || topCats[0] || '');

        setSaleProducts(inStockProducts.filter(isSale).slice(0, 4));


        const sortedNew = [...inStockProducts].sort((a, b) => {
          const ta = new Date(a?.created_at || 0).getTime();
          const tb = new Date(b?.created_at || 0).getTime();
          if (tb !== ta) return tb - ta;
          return Number(b?.id || 0) - Number(a?.id || 0);
        });
        setNewProducts(sortedNew.slice(0, 4));

      } catch (error) {
        console.error('Lỗi tải trang chủ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Banner */}
      {loading ? (
        <div className="w-full h-[500px] bg-slate-200 animate-pulse mb-12"></div>
      ) : banners.length > 0 ? (
        <BannerSlider banners={banners} />
      ) : (
        <section className="relative bg-slate-900 text-white py-24 px-4 overflow-hidden mb-12">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000')] bg-cover bg-center opacity-30"></div>
          <div className="relative max-w-7xl mx-auto text-center z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              TILE <span className="text-indigo-500">STORE</span> VIETNAM
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto font-light">
              Không gian sống đẳng cấp bắt đầu từ những chi tiết nhỏ nhất.
            </p>
            <Link
              href="/product"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl"
            >
              Khám Phá Ngay
            </Link>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* KHUYẾN MÃI */}
        <div className="flex items-end justify-between mb-6 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Sản phẩm khuyến mãi</h2>
            <p className="text-slate-500 mt-1">Giảm giá hấp dẫn, số lượng có hạn</p>
          </div>
          <Link href="/product" className="hidden md:block text-indigo-600 font-semibold hover:text-indigo-800 transition">
            Xem tất cả &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={'sale-' + i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {saleProducts.length > 0 ? (
              saleProducts.map((p) => <ProductCard key={'sale-' + p.id} product={p} />)
            ) : (
              <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-xl shadow-sm">
                Hiện chưa có sản phẩm khuyến mãi.
              </div>
            )}
          </div>
        )}
        {/* ✅ SECTION: SẢN PHẨM THEO DANH MỤC */}
        <div className="mt-14">
          <div className="flex items-end justify-between mb-6 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Sản phẩm theo danh mục</h2>
              <p className="text-slate-500 mt-1">Chọn danh mục để xem nhanh sản phẩm</p>
            </div>
            <Link
              href="/product"
              className="hidden md:block text-indigo-600 font-semibold hover:text-indigo-800 transition"
            >
              Xem tất cả →
            </Link>
          </div>

          {/* Tabs danh mục */}
          {catList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {catList.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCat(c)}
                  className={`px-4 py-2 rounded-full border font-bold text-sm transition ${activeCat === c
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Grid theo danh mục đang chọn */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={'cat-' + i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(catMap?.[activeCat] || []).slice(0, 4).map((p) => (
                <ProductCard key={'cat-' + p.id} product={p} />
              ))}

              {(catMap?.[activeCat] || []).length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-xl shadow-sm">
                  Danh mục này chưa có sản phẩm.
                </div>
              )}
            </div>
          )}

          {activeCat && !loading && (catMap?.[activeCat]?.length || 0) > 0 && (
            <div className="mt-6 text-center">
              <Link
                href={`/product?category=${encodeURIComponent(activeCat)}`}
                className="inline-block border border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-indigo-50"
              >
                Xem thêm trong “{activeCat}”
              </Link>
            </div>
          )}
        </div>

        {/* MỚI VỀ */}
        <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Sản phẩm mới về</h2>
            <p className="text-slate-500 mt-1">Cập nhật xu hướng gạch ốp lát 2025</p>
          </div>
          <Link href="/product" className="hidden md:block text-indigo-600 font-semibold hover:text-indigo-800 transition">
            Xem tất cả &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={'new-' + i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.length > 0 ? (
              newProducts.map((p) => <ProductCard key={'new-' + p.id} product={p} />)
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl shadow-sm">
                Hiện chưa có sản phẩm nào mới.
              </div>
            )}
          </div>
        )}

        {/* ✅ BÀI VIẾT MỚI NHẤT */}
        <div className="mt-14">
          <div className="flex items-end justify-between mb-6 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Bài viết mới nhất</h2>
              <p className="text-slate-500 mt-1">Tin tức & chia sẻ mới cập nhật</p>
            </div>
            <Link href="/blog" className="hidden md:block text-indigo-600 font-semibold hover:text-indigo-800 transition">
              Xem tất cả &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => <PostSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestPosts.length > 0 ? (
                latestPosts.map((p) => <PostCard key={p.id} post={p} />)
              ) : (
                <div className="col-span-full py-10 text-center text-slate-500 bg-white rounded-xl shadow-sm">
                  Hiện chưa có bài viết nào.
                </div>
              )}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/blog" className="inline-block border border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-bold">
              Xem tất cả bài viết
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/product" className="inline-block border border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-bold">
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
