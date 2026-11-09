import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productAPI, categoryAPI, uploadAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { ArrowLeft, Save, Upload, Leaf, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AddEditProduct = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { isFarmerApproved, farmerProfile } = useAuth();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    unit: 'kg',
    availableQuantity: '',
    minOrderQuantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    isOrganic: true,
    harvestDate: new Date().toISOString().split('T')[0],
    isActive: true,
  });

  // Fetch categories and product if editing
  useEffect(() => {
    categoryAPI.getCategories().then((res) => {
      if (res.categories && res.categories.length > 0) {
        setCategories(res.categories);
        if (!isEditing) {
          setFormData((prev) => ({ ...prev, category: res.categories[0]._id }));
        }
      }
    });

    if (isEditing) {
      productAPI
        .getProductById(id)
        .then((res) => {
          if (res.product) {
            const p = res.product;
            setFormData({
              name: p.name || '',
              description: p.description || '',
              category: p.category?._id || '',
              price: p.price || '',
              unit: p.unit || 'kg',
              availableQuantity: p.availableQuantity || '',
              minOrderQuantity: p.minOrderQuantity || 1,
              imageUrl: p.images?.[0] || '',
              isOrganic: p.isOrganic !== undefined ? p.isOrganic : true,
              harvestDate: p.harvestDate
                ? new Date(p.harvestDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
              isActive: p.isActive !== undefined ? p.isActive : true,
            });
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category || !formData.price || formData.availableQuantity === '') {
      toast.error('Please complete all required fields');
      return;
    }

    if (Number(formData.price) <= 0) {
      toast.error('Product price must be greater than zero');
      return;
    }

    if (Number(formData.availableQuantity) < 0) {
      toast.error('Available quantity cannot be negative');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        unit: formData.unit,
        availableQuantity: Number(formData.availableQuantity),
        minOrderQuantity: Number(formData.minOrderQuantity) || 1,
        images: [formData.imageUrl],
        isOrganic: formData.isOrganic,
        harvestDate: formData.harvestDate,
        isActive: formData.isActive,
      };

      let res;
      if (isEditing) {
        res = await productAPI.updateProduct(id, payload);
      } else {
        res = await productAPI.createProduct(payload);
      }

      if (res.success) {
        toast.success(isEditing ? 'Crop updated successfully!' : 'Crop published to marketplace!');
        navigate('/farmer/products');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader message="Loading crop details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          to="/farmer/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174D32] hover:text-[#63A66B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#BAD5C1]/60 shadow-xs space-y-6">
        <div className="border-b border-[#BAD5C1]/30 pb-4">
          <h2 className="text-xl font-extrabold text-[#174D32]">
            {isEditing ? 'Edit Crop Listing' : 'Publish Fresh Harvest Listing'}
          </h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            Set honest pricing, accurate harvest dates, and stock units for consumer orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Crop / Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Organic Vine-Ripened Farm Tomatoes"
                className="w-full px-4 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">
                  Product Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#174D32] font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">
                  Harvest Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">
                  Unit Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 45"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">
                  Selling Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#174D32] font-semibold focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                >
                  <option value="kg">kg (Kilogram)</option>
                  <option value="gram">gram</option>
                  <option value="bunch">bunch</option>
                  <option value="dozen">dozen</option>
                  <option value="litre">litre</option>
                  <option value="box">box</option>
                  <option value="piece">piece</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#174D32] block mb-1">
                  Available Quantity in Stock *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.availableQuantity}
                  onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                  placeholder="e.g. 150"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Product Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
              {formData.imageUrl && (
                <div className="mt-2 w-24 h-24 rounded-2xl overflow-hidden border border-[#BAD5C1]/50 bg-slate-50">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Crop Description & Taste Profile *
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe how it was grown, ripeness, flavor characteristics, and storage tips..."
                className="w-full p-3 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>

            {/* Checkboxes for Organic & Active */}
            <div className="pt-2 flex flex-col sm:flex-row gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOrganic}
                  onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                  className="w-4 h-4 text-[#174D32] focus:ring-[#63A66B] rounded border-[#BAD5C1]"
                />
                <span className="text-xs font-bold text-[#174D32] flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-[#63A66B]" />
                  Mark as 100% Organic Certified
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#174D32] focus:ring-[#63A66B] rounded border-[#BAD5C1]"
                />
                <span className="text-xs font-bold text-[#174D32]">
                  Publish as Active (Visible in Store)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-[#BAD5C1]/30 flex justify-end gap-3">
            <Link to="/farmer/products">
              <Button variant="secondary" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              icon={Save}
            >
              {isEditing ? 'Save Crop Changes' : 'Publish Crop'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProduct;

