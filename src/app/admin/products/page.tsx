'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Plus, Pencil, Trash2, Save, X, Upload, Check, Star, Zap } from 'lucide-react';
import { createProductAction, updateProductAction, deleteProductAction, toggleProductActionStatus } from '@/actions/products';
import Image from 'next/image';
import { Toast, ToastType } from '@/components/ui/Toast';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
        message: '',
        type: 'success',
        isVisible: false
    });

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({ message, type, isVisible: true });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }));
    };

    const fetchData = async () => {
        const [pStore, cStore] = await Promise.all([
            supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
            supabase.from('categories').select('*').order('sort_order', { ascending: true })
        ]);
        setProducts(pStore.data || []);
        setCategories(cStore.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async (file: File) => {
        setUploading(true);

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
            alert('Помилка: Ви не авторизовані. Будь ласка, увійдіть знову.');
            window.location.href = '/admin/login';
            return null;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) {
            showToast('Помилка завантаження: ' + uploadError.message, 'error');
            setUploading(false);
            return null;
        }

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        setUploading(false);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        let imageUrl = editingProduct?.image || '';
        const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput.files?.[0]) {
            const uploadedUrl = await handleImageUpload(fileInput.files[0]);
            if (uploadedUrl) imageUrl = uploadedUrl;
            else return; // Stop if upload failed
        }

        const productData: any = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            discount_price: formData.get('discount_price') ? parseFloat(formData.get('discount_price') as string) : null,
            image: imageUrl,
            category_id: formData.get('category_id') as string,
            weight: formData.get('weight') as string,
            is_popular: formData.get('is_popular') === 'on',
            is_action: formData.get('is_action') === 'on',
            sort_order: parseInt(formData.get('sort_order') as string || '0'),
        };

        if (!editingProduct) {
            productData.id = `p${Date.now()}`;
        }

        if (!editingProduct) {
            productData.id = `p${Date.now()}`;
        }

        console.log('Saving product data:', productData);

        const { error: dbError } = editingProduct
            ? await supabase.from('products').update(productData).eq('id', editingProduct.id)
            : await supabase.from('products').insert([productData]);

        if (!dbError) {
            console.log('Product saved successfully');
            setIsAdding(false);
            setEditingProduct(null);
            setPreviewUrl(null);
            fetchData();
            showToast('Збережено успішно!', 'success');
        } else {
            console.error('Error saving product:', dbError);
            showToast('Помилка збереження: ' + dbError.message, 'error');
        }
    };

    const handleDelete = (id: string) => {
        setDeletingProductId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deletingProductId) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', deletingProductId);
            if (!error) {
                fetchData();
                showToast('Видалено успішно!', 'success');
            } else {
                console.error('Delete error:', error);
                showToast('Помилка видалення: ' + error.message, 'error');
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            showToast('Сталася несподівана помилка при видаленні', 'error');
        } finally {
            setDeletingProductId(null);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-2">
                        Товари
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">Керування асортиментом PizzaHouse</p>
                </div>
                <button
                    onClick={() => { setIsAdding(true); setEditingProduct(null); setPreviewUrl(null); }}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black uppercase text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    Додати товар
                </button>
            </div>

            {(isAdding || editingProduct) && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black uppercase italic">{editingProduct ? 'Редагувати товар' : 'Новий товар'}</h2>
                            <button onClick={() => { setIsAdding(false); setEditingProduct(null); setPreviewUrl(null); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Назва</label>
                                    <input name="name" defaultValue={editingProduct?.name} required className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border-gray-100 bg-gray-50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Категорія</label>
                                    <select name="category_id" defaultValue={editingProduct?.category_id} required className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border-gray-100 bg-gray-50">
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Ціна (грн)</label>
                                    <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border-gray-100 bg-gray-50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Ціна зі знижкою</label>
                                    <input name="discount_price" type="number" step="0.01" defaultValue={editingProduct?.discount_price} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border-gray-100 bg-gray-50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Вага (напр. 550г)</label>
                                    <input name="weight" defaultValue={editingProduct?.weight} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border-gray-100 bg-gray-50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Порядок сортування</label>
                                    <input name="sort_order" type="number" defaultValue={editingProduct?.sort_order || 0} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border-gray-100 bg-gray-50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Опис</label>
                                <textarea name="description" defaultValue={editingProduct?.description} rows={3} className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary/20 border-gray-100 bg-gray-50 resize-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Фото товару</label>
                                <div className="flex items-center gap-4">
                                    {(previewUrl || editingProduct?.image) && (
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border">
                                            <Image src={previewUrl || editingProduct.image} alt="" fill className="object-cover" />
                                        </div>
                                    )}
                                    <label className="flex-grow flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary/50 cursor-pointer transition-all">
                                        <Upload size={20} className="text-gray-400" />
                                        <span className="text-sm font-bold text-gray-500">{uploading ? 'Завантаження...' : 'Обрати нове фото'}</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name="is_popular" defaultChecked={editingProduct?.is_popular} className="w-5 h-5 rounded accent-primary" />
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Популярний</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name="is_action" defaultChecked={editingProduct?.is_action} className="w-5 h-5 rounded accent-primary" />
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Акційний</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase text-lg hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                            >
                                {editingProduct ? 'Зберегти зміни' : 'Створити товар'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-medium italic">Завантаження...</div>
                ) : products.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-gray-400 font-medium italic">Товарів не знайдено</div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="relative h-48">
                                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {product.is_popular && (
                                        <div className="bg-blue-500 text-white p-2 rounded-lg shadow-lg">
                                            <Star size={16} fill="white" />
                                        </div>
                                    )}
                                    {product.is_action && (
                                        <div className="bg-orange-500 text-white p-2 rounded-lg shadow-lg">
                                            <Zap size={16} fill="white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">
                                        {product.categories?.name}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400">{product.weight}</span>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2 truncate uppercase italic leading-none">{product.name}</h3>
                                <div className="flex items-center gap-3 mb-6">
                                    {product.discount_price ? (
                                        <>
                                            <span className="text-2xl font-black text-primary italic tracking-tighter leading-none">{product.discount_price} грн</span>
                                            <span className="text-sm font-bold text-gray-300 line-through">{product.price} грн</span>
                                        </>
                                    ) : (
                                        <span className="text-2xl font-black text-gray-900 italic tracking-tighter leading-none">{product.price} грн</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingProduct(product); setPreviewUrl(null); }} className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-all">
                                        <Pencil size={16} />
                                        Редагувати
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDelete(product.id);
                                        }}
                                        className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deletingProductId && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic text-gray-900">Видалити товар?</h3>
                            <p className="text-gray-500 font-medium">Цю дію неможливо відмінити. Товар буде видалено з меню та усіх замовлень.</p>

                            <div className="grid grid-cols-2 gap-4 w-full mt-6">
                                <button
                                    onClick={() => setDeletingProductId(null)}
                                    className="py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Скасувати
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Видалити
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />

        </AdminLayout>
    );
}
