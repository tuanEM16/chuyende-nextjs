'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ProductAttributeService from '@/services/ProductAttributeService';
import ProductService from '@/services/ProductService';
import AttributeService from '@/services/AttributeService';


const SaveIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const TagIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;

export default function EditProductAttributeBulk({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const currentId = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);


    const [attributeDefinitions, setAttributeDefinitions] = useState([]); // Danh sách loại (Màu, Size...)
    

    const [productInfo, setProductInfo] = useState(null);


    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (!currentId) return;

        const initData = async () => {
            try {
                setFetching(true);


                const attrDefRes = await AttributeService.index();
                setAttributeDefinitions(attrDefRes.data?.data || attrDefRes.data || []);


                const currentRes = await ProductAttributeService.show(currentId);
                const currentItem = currentRes.data?.data || currentRes.data;
                
                if (!currentItem) throw new Error("Không tìm thấy dữ liệu gốc");


                const prodRes = await ProductService.show(currentItem.product_id);
                setProductInfo(prodRes.data?.data || prodRes.data);



                const allAttrRes = await ProductAttributeService.index();
                const allItems = allAttrRes.data?.data || allAttrRes.data || [];
                

                const siblings = allItems.filter(item => String(item.product_id) === String(currentItem.product_id));


                const mappedRows = siblings.map(item => ({
                    id: item.id,            // ID thực trong DB
                    attribute_id: item.attribute_id,
                    value: item.value,
                    is_new: false,          // Đánh dấu là cũ
                    is_deleted: false,      // Đánh dấu xóa
                    is_changed: false       // Đánh dấu có sửa
                }));

                setRows(mappedRows);

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                alert("Có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setFetching(false);
            }
        };

        initData();
    }, [currentId]);




    const handleAddRow = () => {
        setRows([
            ...rows, 
            { 
                id: Date.now(), // ID tạm
                attribute_id: '', 
                value: '', 
                is_new: true, 
                is_deleted: false,
                is_changed: true 
            }
        ]);
    };


    const handleChange = (index, field, val) => {
        const newRows = [...rows];
        newRows[index][field] = val;
        newRows[index].is_changed = true;
        setRows(newRows);
    };


    const handleDeleteRow = (index) => {
        const newRows = [...rows];
        if (newRows[index].is_new) {
            newRows.splice(index, 1); // Xóa khỏi mảng
        } else {
            newRows[index].is_deleted = true; // Ẩn đi và đánh dấu xóa
        }
        setRows(newRows);
    };


    const handleUndoDelete = (index) => {
        const newRows = [...rows];
        newRows[index].is_deleted = false;
        setRows(newRows);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productId = productInfo.id;
            const promises = [];


            const toDelete = rows.filter(r => !r.is_new && r.is_deleted);
            toDelete.forEach(r => {
                promises.push(ProductAttributeService.destroy(r.id));
            });


            const toCreate = rows.filter(r => r.is_new && !r.is_deleted);
            toCreate.forEach(r => {
                if(r.attribute_id && r.value) {
                    promises.push(ProductAttributeService.store({
                        product_id: productId,
                        attribute_id: r.attribute_id,
                        value: r.value
                    }));
                }
            });


            const toUpdate = rows.filter(r => !r.is_new && !r.is_deleted && r.is_changed);
            toUpdate.forEach(r => {
                 promises.push(ProductAttributeService.update(r.id, {
                    product_id: productId,
                    attribute_id: r.attribute_id,
                    value: r.value
                }));
            });

            if (promises.length === 0) {
                alert("Không có thay đổi nào để lưu.");
                setLoading(false);
                return;
            }

            await Promise.all(promises);
            alert("Cập nhật thành công!");
            router.push('/admin/productattribute');

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra: " + (error.message || "Lỗi server"));
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center py-20 animate-pulse text-slate-500">Đang tải dữ liệu thuộc tính...</div>;
    if (!productInfo) return <div className="text-center py-20 text-red-500">Không tìm thấy thông tin sản phẩm.</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <TagIcon /> Quản lý Thuộc tính Sản phẩm
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* --- CỘT TRÁI: THÔNG TIN SẢN PHẨM --- */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 sticky top-6 text-center">
                        <div className="aspect-square bg-slate-50 rounded-lg mb-4 overflow-hidden border border-slate-100 flex items-center justify-center">
                            <img 
                                src={ProductService.getImageUrl(productInfo.thumbnail)} 
                                className="w-full h-full object-contain"
                                onError={(e) => e.target.src="https://placehold.co/300x300"}
                            />
                        </div>
                        <h2 className="font-bold text-slate-800 text-lg mb-1">{productInfo.name}</h2>
                        <p className="text-slate-500 text-sm mb-4">Mã SP: {productInfo.id}</p>
                        
                        <div className="text-xs text-left bg-indigo-50 text-indigo-800 p-3 rounded border border-indigo-100">
                            <strong>Mẹo:</strong> Tại đây bạn có thể thêm nhiều thuộc tính (Màu, Size, Chất liệu...) cho sản phẩm này cùng một lúc.
                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI: DANH SÁCH THUỘC TÍNH --- */}
                <div className="lg:col-span-3">
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                            <h3 className="font-bold text-slate-700">Danh sách các thuộc tính</h3>
                            <button 
                                type="button" 
                                onClick={handleAddRow}
                                className="text-sm bg-white border border-indigo-300 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 font-medium flex items-center gap-1 transition"
                            >
                                <PlusIcon /> Thêm dòng
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {rows.map((row, index) => {
                                if (row.is_deleted && !row.is_new) {

                                    return (
                                        <div key={row.id} className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-lg opacity-70">
                                            <span className="text-sm text-red-500 italic flex items-center gap-2">
                                                <TrashIcon /> Dòng này sẽ bị xóa
                                            </span>
                                            <button 
                                                type="button" 
                                                onClick={() => handleUndoDelete(index)}
                                                className="text-xs underline text-slate-600 hover:text-indigo-600"
                                            >
                                                Hoàn tác (Undo)
                                            </button>
                                        </div>
                                    );
                                }
                                
                                if (row.is_deleted) return null; // Dòng mới mà xóa thì ẩn luôn

                                return (
                                    <div key={row.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 border rounded-lg hover:border-indigo-300 transition bg-white group shadow-sm">
                                        
                                        {/* 1. Chọn Loại */}
                                        <div className="w-full sm:w-1/3">
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Loại thuộc tính</label>
                                            <select 
                                                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                                value={row.attribute_id}
                                                onChange={(e) => handleChange(index, 'attribute_id', e.target.value)}
                                                required
                                            >
                                                <option value="">-- Chọn --</option>
                                                {attributeDefinitions.map(def => (
                                                    <option key={def.id} value={def.id}>{def.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* 2. Nhập Giá trị */}
                                        <div className="flex-1 w-full">
                                            <label className="block text-xs font-bold text-slate-500 mb-1">Giá trị</label>
                                            <input 
                                                type="text" 
                                                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                                                value={row.value}
                                                onChange={(e) => handleChange(index, 'value', e.target.value)}
                                                placeholder="VD: Đỏ, XL, Cotton..."
                                                required
                                            />
                                        </div>

                                        {/* 3. Nút Xóa */}
                                        <div className="mt-6 sm:mt-0 pt-1">
                                            <button 
                                                type="button" 
                                                onClick={() => handleDeleteRow(index)}
                                                className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition"
                                                title="Xóa dòng này"
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {rows.filter(r => !r.is_deleted).length === 0 && (
                                <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-lg">
                                    Sản phẩm này chưa có thuộc tính nào.
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-slate-50 border-t flex justify-end">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold shadow hover:bg-indigo-700 transition flex items-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Đang lưu...' : <><SaveIcon /> LƯU THAY ĐỔI</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}