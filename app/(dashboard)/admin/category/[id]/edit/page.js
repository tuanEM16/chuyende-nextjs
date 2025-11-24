import Link from 'next/link';

// --- INLINE SVG ICONS ---
const ArrowLeftIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const SaveIcon = ({ size = 20 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);
// --- END ICONS ---

// Mock function để lấy dữ liệu (thực tế sẽ gọi API)
const getCategory = (id) => {
    return {
        id,
        name: 'Thời trang',
        slug: 'thoi-trang',
        description: 'Các sản phẩm quần áo, giày dép thời trang mới nhất.'
    };
};

export default async function EditCategoryPage({ params }) {
    // QUAN TRỌNG: await params trước khi truy cập id
    const { id } = await params;
    const category = getCategory(id);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Chỉnh sửa Danh mục</h1>
                <Link href="/dashboard/admin/category" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon />
                    <span className="ml-2">Quay lại</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                    Đang chỉnh sửa danh mục ID: <strong>{id}</strong>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tên danh mục</label>
                        <input
                            type="text"
                            defaultValue={category.name}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Slug</label>
                        <input
                            type="text"
                            defaultValue={category.slug}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mô tả</label>
                        <textarea
                            rows="4"
                            defaultValue={category.description}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="button" // Thay bằng submit khi có logic xử lý
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
                        >
                            <SaveIcon />
                            <span>Cập nhật</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}