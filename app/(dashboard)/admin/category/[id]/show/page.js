import Link from 'next/link';

// --- INLINE SVG ICONS ---
const ArrowLeftIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const EditIcon = ({ size = 18 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);
// --- END ICONS ---

const getCategory = (id) => {
    return {
        id,
        name: 'Thời trang',
        slug: 'thoi-trang',
        description: 'Các sản phẩm quần áo, giày dép thời trang mới nhất.',
        createdAt: '2023-10-15',
        productsCount: 50
    };
};

export default async function ShowCategoryPage({ params }) {
    // QUAN TRỌNG: await params
    const { id } = await params;
    const category = getCategory(id);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Chi tiết Danh mục</h1>
                <Link href="/dashboard/admin/category" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{category.name}</h2>
                    <Link 
                        href={`/dashboard/admin/category/${id}/edit`} 
                        className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-medium bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm transition"
                    >
                        <EditIcon size={16} />
                        <span>Chỉnh sửa</span>
                    </Link>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ID</label>
                            <p className="text-slate-800 font-medium">{category.id}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Slug</label>
                            <p className="text-slate-800 font-mono bg-slate-100 inline-block px-2 py-1 rounded text-sm">{category.slug}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ngày tạo</label>
                            <p className="text-slate-800">{category.createdAt}</p>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Số lượng sản phẩm</label>
                            <p className="text-indigo-600 font-bold text-lg">{category.productsCount}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Mô tả</label>
                        <div className="bg-slate-50 p-4 rounded-lg text-slate-700 leading-relaxed border border-slate-100">
                            {category.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}