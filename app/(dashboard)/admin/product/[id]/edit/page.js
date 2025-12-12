'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductService from '@/services/ProductService';
import CategoryService from '@/services/CategoryService';

const SaveIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>;
const ArrowLeftIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const UploadIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>;
const TrashIcon = ({ size = 16 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const PlusIcon = ({ size = 20 }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;


export default function EditProductPage({ params: paramsPromise }) {
    const params = use(paramsPromise);
    const id = params.id;
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    
    // Thumbnail states
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Gallery states
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [oldGallery, setOldGallery] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        price: '',
        stock: '0',
        description: '',
        status: 1
    });

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Fetch Categories and Product Data
                const [catRes, prodRes] = await Promise.all([
                    CategoryService.index(),
                    ProductService.show(id)
                ]);

                // 1. Process Categories
                if (catRes.success) {
                    setCategories(catRes.data.data || catRes.data || []);
                } else if (catRes.data && (catRes.data.success || Array.isArray(catRes.data))) {
                     setCategories(catRes.data.data || catRes.data);
                }


                // 2. Process Product Data
                const productData = prodRes.success ? prodRes.data : (prodRes.data && prodRes.data.data ? prodRes.data.data : prodRes.data);

                if (productData) {
                    setFormData({
                        name: productData.name,
                        category_id: productData.category_id,
                        price: productData.price_buy,
                        stock: productData.qty || 0,
                        description: productData.description || '',
                        status: productData.status
                    });

                    if (productData.thumbnail) {
                        setCurrentImageUrl(ProductService.getImageUrl(productData.thumbnail));
                    }
                    
                    if (productData.product_images) {
                        setOldGallery(productData.product_images);
                    }
                } else {
                    console.error("API returned error or product not found");
                }

            } catch (error) {
                console.error("Error loading data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Thumbnail Handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // Gallery Handlers
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryFiles(prev => [...prev, ...files]);
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeOldGalleryImage = (imageId) => {
        if(confirm("Remove this image from display? (Click Update to apply)")) {
            setOldGallery(prev => prev.filter(img => img.id !== imageId));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('category_id', formData.category_id);
            data.append('price_buy', formData.price);
            data.append('qty', formData.stock);
            data.append('description', formData.description);
            data.append('content', formData.description);
            data.append('status', formData.status);
            data.append('_method', 'PUT'); // Required for update

            // Thumbnail
            if (imageFile) {
                data.append('thumbnail', imageFile);
            }

            // Gallery Images
            galleryFiles.forEach((file) => {
                data.append('product_images[]', file);
            });

            const res = await ProductService.update(id, data);
            
            if (res.success) {
                alert('Update successful!');
                router.push('/admin/product');
            } else {
                alert('Update failed: ' + res.message);
            }

        } catch (error) {
            console.error(error);
            alert('System error!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Edit Product</h1>
                <Link href="/admin/product" className="flex items-center text-slate-500 hover:text-indigo-600 transition">
                    <ArrowLeftIcon /> <span className="ml-2">Back to List</span>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- LEFT COLUMN --- */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 space-y-4">
                        <h2 className="font-bold text-slate-700 border-b pb-2">General Information</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Price</label>
                                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea name="description" rows="6" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-indigo-500 outline-none"></textarea>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="space-y-6">
                    {/* Settings */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 space-y-4">
                        <h2 className="font-bold text-slate-700">Settings</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                            <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                                <option value="">-- Select Category --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg outline-none">
                                <option value="1">Published</option>
                                <option value="2">Draft</option>
                            </select>
                        </div>
                    </div>

                    {/* Thumbnail Image */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 text-center">
                        <label className="block text-sm font-bold text-slate-700 mb-2 text-left">Thumbnail Image</label>
                        {previewUrl ? <img src={previewUrl} className="h-40 mx-auto object-contain mb-2" /> : currentImageUrl ? <img src={currentImageUrl} className="h-40 mx-auto object-contain mb-2 border" /> : <div className="h-40 flex items-center justify-center bg-gray-50 border-2 border-dashed rounded mb-2"><UploadIcon /></div>}
                        <input type="file" onChange={handleImageChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    </div>

                    {/* Gallery Images */}
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Image Gallery</label>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            {/* Old Gallery Images */}
                            {oldGallery.map((img) => (
                                <div key={img.id} className="relative h-20 border rounded overflow-hidden group">
                                    <img src={ProductService.getImageUrl(img.image)} className="w-full h-full object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeOldGalleryImage(img.id)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <TrashIcon size={12}/>
                                    </button>
                                </div>
                            ))}
                            
                            {/* New Gallery Images */}
                            {galleryPreviews.map((src, idx) => (
                                <div key={`new-${idx}`} className="relative h-20 border rounded overflow-hidden border-indigo-300 group">
                                    <img src={src} className="w-full h-full object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeGalleryImage(idx)}
                                        className="absolute top-0 right-0 bg-red-500 text-white p-0.5"
                                    >
                                        <TrashIcon size={12}/>
                                    </button>
                                </div>
                            ))}

                            {/* Add New Image Button */}
                            <label className="h-20 border-2 border-dashed border-slate-300 rounded flex items-center justify-center cursor-pointer hover:bg-slate-50 transition">
                                <PlusIcon className="text-slate-400" />
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryChange} />
                            </label>
                        </div>
                        <p className="text-xs text-slate-500">Select multiple images to add to the gallery.</p>
                    </div>

                    <button type="submit" disabled={loading} className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium shadow-md">
                        {loading ? 'Saving...' : <><SaveIcon /><span>Update Product</span></>}
                    </button>
                </div>
            </form>
        </div>
    );
}