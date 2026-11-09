import React, { useState, useEffect } from 'react';
import { productAPI } from '../../api';
import { OrganicBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { Package, Search, Trash2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Delete modal
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productAPI.getProducts({ search: searchTerm, limit: 100 });
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (error) {
      toast.error('Failed to load marketplace products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleToggleProductActive = async (product) => {
    try {
      const res = await productAPI.updateStock(product._id, {
        isActive: !product.isActive,
      });
      if (res.success) {
        toast.success(`Product "${product.name}" is now ${!product.isActive ? 'Active' : 'Hidden'}`);
        fetchProducts();
      }
    } catch (error) {
      toast.error('Could not change product status');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductTarget) return;
    try {
      setIsDeleting(true);
      const res = await productAPI.deleteProduct(deleteProductTarget._id);
      if (res.success) {
        toast.success('Listing removed from marketplace');
        setDeleteProductTarget(null);
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#174D32]">Marketplace Crop Moderation</h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            Monitor product listings across all registered farms, prices, and quality compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product or farm..."
              className="pl-8 pr-3 py-2 rounded-xl bg-white border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
            <Search className="w-3.5 h-3.5 text-[#78897E] absolute left-2.5 top-2.5" />
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchProducts}>
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader message="Auditing product listings..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Products Found"
          description="No crops listed matching your search query."
        />
      ) : (
        <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#BAD5C1]/30 bg-[#F7F8EF]/60 text-[11px] font-bold uppercase tracking-wider text-[#78897E]">
                  <th className="py-3.5 px-5">Crop Name</th>
                  <th className="py-3.5 px-4">Farmer / Farm</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Available</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAD5C1]/20">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F0F6F2]/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#BAD5C1]/40 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#174D32] line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-[#78897E]">
                            Harvest: {new Date(p.harvestDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A5B50] font-medium">
                      {p.farmerProfile?.farmName || p.farmer?.name || 'Local Farm'}
                    </td>
                    <td className="py-3.5 px-4 text-[#78897E]">{p.category?.name || 'General'}</td>
                    <td className="py-3.5 px-4 font-bold text-[#174D32]">
                      ₹{p.price} /{p.unit}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#202B24]">
                      {p.availableQuantity} {p.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.isOrganic ? <OrganicBadge size="sm" /> : <span className="text-[#78897E]">Conventional</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleProductActive(p)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                            p.isActive
                              ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          }`}
                        >
                          {p.isActive ? 'Hide' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteProductTarget(p)}
                          className="p-1 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Listing"
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
        isOpen={Boolean(deleteProductTarget)}
        onClose={() => setDeleteProductTarget(null)}
        title="Confirm Delete Listing"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#4A5B50] leading-relaxed">
            As an administrator, are you sure you want to delete{' '}
            <span className="font-bold text-[#174D32]">"{deleteProductTarget?.name}"</span>? This will permanently remove the item from the marketplace.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeleteProductTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDeleting}
              onClick={handleDeleteProduct}
            >
              Delete Listing
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProducts;

