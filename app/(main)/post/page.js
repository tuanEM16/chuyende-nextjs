import Link from 'next/link';
import { Calendar } from 'lucide-react';

const mockPosts = [
    { id: 1, title: 'Hướng dẫn tối ưu SEO cho cửa hàng E-Commerce', date: '10/05/2025', summary: 'Các bước cơ bản để cải thiện thứ hạng tìm kiếm cho trang web bán hàng của bạn.' },
    { id: 2, title: 'Review chi tiết Máy ảnh Mirrorless X100', date: '01/05/2025', summary: 'Đánh giá chuyên sâu về hiệu năng, thiết kế và chất lượng hình ảnh của mẫu máy ảnh hot nhất năm.' },
    { id: 3, title: '5 mẹo lập trình giúp bạn code nhanh hơn', date: '25/04/2025', summary: 'Những thủ thuật nhỏ nhưng mang lại hiệu quả lớn trong quá trình phát triển phần mềm.' },
];

const PostCard = ({ post }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col space-y-3">
        <h2 className="text-2xl font-bold text-slate-800 hover:text-indigo-600 transition duration-300">
            <Link href={`/post/${post.id}`}>{post.title}</Link>
        </h2>
        <div className="flex items-center text-sm text-slate-500">
            <Calendar size={16} className="mr-2" />
            <span>{post.date}</span>
        </div>
        <p className="text-slate-600 flex-grow">{post.summary}</p>
        <Link href={`/post/${post.id}`} className="text-indigo-600 font-medium hover:text-indigo-800 pt-2 border-t border-slate-100 self-start">
            Đọc thêm &rarr;
        </Link>
    </div>
);

export default function PostPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-8 border-b pb-3">Blog & Tin tức</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
            
            {mockPosts.length === 0 && (
                <div className="text-center p-10 bg-slate-100 rounded-xl mt-8">
                    <p className="text-xl text-slate-600">Hiện chưa có bài viết nào.</p>
                </div>
            )}
        </div>
    );
}