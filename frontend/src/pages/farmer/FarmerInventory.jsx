import React, { useState, useEffect } from 'react';
import { productAPI } from '../../api';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Boxes, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerInventory = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stockEdits, setStockEdits] = useState({});
  const [savingId, setSavingId] = useState(null);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await productAPI.getMyFarmerProducts();
      if (res.success) {
        setProducts(res.products || []);
        // Initialize local edit state
        const initial = {};
        (res.products || []).forEach((p) => {
          initial[p._id] = {
            availableQuantity: p.availableQuantity,
            isActive: p.isActive,
          };
        });
        setStockEdits(initial);
      }
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (productId, newQty) => {
    setStockEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        availableQuantity: Math.max(0, Number(newQty)),
      },
    }));
  };

  const handleToggleActive = (productId) => {
    setStockEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        isActive: !prev[productId]?.isActive,
      },
    }));
  };

  const saveProductStock = async (productId) => {
    const edit = stockEdits[productId];
    if (!edit) return;

    try {
      setSavingId(productId);
      const res = await productAPI.updateStock(productId, {
        availableQuantity: edit.availableQuantity,
        isActive: edit.isActive,
      });

      if (res.success) {
        toast.success('Stock updated!');
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? res.product : p))
        );
      }
    } catch (error) {
      toast.error(error.message || 'Could not update stock');
    } finally {
      setSavingId(null);
    }
  };

  if (isLoading) {
    return <Loader message="Auditing harvest stock records..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#174D32]">
            Live Inventory & Stock Manager
          </h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            Quickly adjust available kilograms or boxes after morning harvest counts.
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchInventory}>
          Refresh Stock
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No Products in Inventory"
          description="You don't have any products listed to manage yet."
          actionLabel="Add Product"
          onAction={() => (window.location.href = '/farmer/products/new')}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#BAD5C1]/30 bg-[#F7F8EF]/60 text-[11px] font-bold uppercase tracking-wider text-[#78897E]">
                  <th className="py-3.5 px-5">Crop</th>
                  <th className="py-3.5 px-4">Selling Unit</th>
                  <th className="py-3.5 px-4">Stock Alert</th>
                  <th className="py-3.5 px-4">Stock Quantity</th>
                  <th className="py-3.5 px-4">Store Visibility</th>
                  <th className="py-3.5 px-5 text-right">Quick Save</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAD5C1]/20 text-xs">
                {products.map((p) => {
                  const currentEdit = stockEdits[p._id] || {
                    availableQuantity: p.availableQuantity,
                    isActive: p.isActive,
                  };
                  const isLowStock = currentEdit.availableQuantity <= 10;
                  const isOutOfStock = currentEdit.availableQuantity === 0;

                  return (
                    <tr key={p._id} className="hover:bg-[#F0F6F2]/30 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#BAD5C1]/40 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#174D32] line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-[#78897E]">₹{p.price}/{p.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#4A5B50]">{p.unit}</td>
                      <td className="py-3.5 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                            <AlertTriangle className="w-3 h-3" />
                            Sold Out
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            <AlertTriangle className="w-3 h-3" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={currentEdit.availableQuantity}
                            onChange={(e) => handleStockChange(p._id, e.target.value)}
                            className="w-24 px-2.5 py-1.5 rounded-xl border border-[#BAD5C1] text-xs font-bold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                          />
                          <span className="text-xs text-[#78897E]">{p.unit}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(p._id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                            currentEdit.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {currentEdit.isActive ? 'Active (Listed)' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Button
                          size="sm"
                          variant="primary"
                          isLoading={savingId === p._id}
                          onClick={() => saveProductStock(p._id)}
                          icon={Check}
                        >
                          Save
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerInventory;

