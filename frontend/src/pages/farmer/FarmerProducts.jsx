import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { OrganicBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { PlusCircle, Search, Edit2, Trash2, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerProducts = () => {
  const { farmerProfile } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productAPI.getMyFarmerProducts();
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      const res = await productAPI.deleteProduct(productToDelete._id);
      if (res.success) {
        toast.success('Product deleted successfully');
        setDeleteModalOpen(false);
        setProductToDelete(null);
        fetchProducts();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search my products..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
          />
          <Search className="w-4 h-4 text-[#78897E] absolute left-3 top-2.5" />
        </div>

        <Link to="/farmer/products/new">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Add New Product
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Loader message="Loading your crops..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Products Listed Yet"
          description="Start publishing your harvest to connect directly with consumers across your region."
          actionLabel="Add Your First Crop"
          onAction={() => navigate('/farmer/products/new')}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#BAD5C1]/30 bg-[#F7F8EF]/60 text-[11px] font-bold uppercase tracking-wider text-[#78897E]">
                  <th className="py-3.5 px-5">Crop / Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price / Unit</th>
                  <th className="py-3.5 px-4">Available Stock</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAD5C1]/20 text-xs">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F0F6F2]/40 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover border border-[#BAD5C1]/40 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#174D32] line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-[#78897E]">
                            Harvested: {new Date(p.harvestDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#4A5B50] font-medium">
                      {p.category?.name || 'General'}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#174D32]">
                      ₹{p.price} <span className="text-[11px] font-normal text-[#78897E]">/{p.unit}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          p.availableQuantity === 0
                            ? 'text-rose-600'
                            : p.availableQuantity <= 10
                            ? 'text-amber-600'
                            : 'text-[#174D32]'
                        }`}
                      >
                        {p.availableQuantity} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.isOrganic ? <OrganicBadge size="sm" /> : <span className="text-[#78897E]">Conventional</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/farmer/products/edit/${p._id}`)}
                          className="p-1.5 rounded-lg text-[#174D32] hover:bg-[#DCEADF] transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToDelete(p);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete Crop"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#4A5B50] leading-relaxed">
            Are you sure you want to remove <span className="font-bold text-[#174D32]">"{productToDelete?.name}"</span> from your catalog? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Delete Product
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FarmerProducts;

