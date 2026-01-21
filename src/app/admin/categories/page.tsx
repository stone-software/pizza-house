'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from '@/actions/categories';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
        setCategories(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            id: formData.get('id') as string,
            name: formData.get('name') as string,
            icon: formData.get('icon') as string,
            sort_order: parseInt(formData.get('sort_order') as string),
        };

        const res = await createCategoryAction(data);
        if (res.success) {
            setIsAdding(false);
            fetchCategories();
        } else {
            alert(res.error);
        }
    };

    const handleUpdate = async (id: string, name: string, icon: string, sort_order: number) => {
        const res = await updateCategoryAction(id, { name, icon, sort_order });
        if (res.success) {
            setEditingId(null);
            fetchCategories();
        } else {
            alert(res.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Ви впевнені? Це може видалити зв’язки з товарами.')) return;
        const res = await deleteCategoryAction(id);
        if (res.success) {
            fetchCategories();
        } else {
            alert(res.error);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-2">
                        Категорії
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">Керування розділами меню</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black uppercase text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus size={18} />
                    Додати категорію
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">ID (key)</th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Назва</th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Іконка</th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest">Порядок</th>
                            <th className="px-6 py-4 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isAdding && (
                            <tr className="border-b border-gray-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                <td colSpan={5} className="p-0">
                                    <form onSubmit={handleAdd} className="flex items-center gap-4 px-6 py-4 bg-primary/5">
                                        <input name="id" placeholder="ID (напр. sets)" className="bg-white border rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:ring-1 ring-primary" required />
                                        <input name="name" placeholder="Назва (напр. Сети)" className="bg-white border rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:ring-1 ring-primary" required />
                                        <input name="icon" placeholder="Іконка (напр. pizza)" className="bg-white border rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:ring-1 ring-primary" />
                                        <input name="sort_order" type="number" placeholder="Порядок" className="bg-white border rounded-lg px-3 py-2 text-sm w-24 outline-none focus:ring-1 ring-primary" defaultValue={0} />
                                        <div className="flex gap-2">
                                            <button type="submit" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                                <Save size={18} />
                                            </button>
                                            <button type="button" onClick={() => setIsAdding(false)} className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        )}
                        {loading ? (
                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium italic">Завантаження...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium italic">Категорій не знайдено</td></tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400">{cat.id}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {editingId === cat.id ? (
                                            <input
                                                id={`name-${cat.id}`}
                                                className="bg-white border rounded px-2 py-1 outline-none focus:ring-1 ring-primary"
                                                defaultValue={cat.name}
                                            />
                                        ) : cat.name}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-600">
                                        {editingId === cat.id ? (
                                            <input
                                                id={`icon-${cat.id}`}
                                                className="bg-white border rounded px-2 py-1 w-full outline-none focus:ring-1 ring-primary"
                                                defaultValue={cat.icon || cat.id}
                                            />
                                        ) : cat.icon || cat.id || '-'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-600">
                                        {editingId === cat.id ? (
                                            <input
                                                id={`sort-${cat.id}`}
                                                type="number"
                                                className="bg-white border rounded px-2 py-1 w-16 outline-none focus:ring-1 ring-primary"
                                                defaultValue={cat.sort_order}
                                            />
                                        ) : cat.sort_order}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId === cat.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        const n = (document.getElementById(`name-${cat.id}`) as HTMLInputElement).value;
                                                        const i = (document.getElementById(`icon-${cat.id}`) as HTMLInputElement).value;
                                                        const s = parseInt((document.getElementById(`sort-${cat.id}`) as HTMLInputElement).value);
                                                        handleUpdate(cat.id, n, i, s);
                                                    }}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                >
                                                    <Save size={18} />
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setEditingId(cat.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
