import React, { useState, useEffect } from 'react';
import { farmerAPI } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { VerificationBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { Save, Building, MapPin, Sprout, Award, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerProfile = () => {
  const { user, updateFarmerProfileData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    farmName: '',
    farmLocation: '',
    district: '',
    state: '',
    pincode: '',
    farmDescription: '',
    farmingMethod: 'Organic Certified',
    cropTypes: 'Vegetables, Fruits',
    experienceYears: 5,
    totalAreaAcres: 5,
    profileImage: '',
    coverImage: '',
    verificationStatus: 'PENDING',
    rejectionReason: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        if (user) {
          const res = await farmerAPI.getFarmerById(user._id || user.id);
          if (res.success && res.farmer) {
            const f = res.farmer;
            setFormData({
              farmName: f.farmName || '',
              farmLocation: f.farmLocation || '',
              district: f.district || '',
              state: f.state || '',
              pincode: f.pincode || '',
              farmDescription: f.farmDescription || '',
              farmingMethod: f.farmingMethod || 'Organic Certified',
              cropTypes: Array.isArray(f.cropTypes) ? f.cropTypes.join(', ') : f.cropTypes || '',
              experienceYears: f.experienceYears || 5,
              totalAreaAcres: f.totalAreaAcres || 5,
              profileImage: f.profileImage || '',
              coverImage: f.coverImage || '',
              verificationStatus: f.verificationStatus || 'PENDING',
              rejectionReason: f.rejectionReason || '',
            });
          }
        }
      } catch (error) {
        console.error('Failed to load farmer profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const cropsArray = formData.cropTypes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        cropTypes: cropsArray,
        experienceYears: Number(formData.experienceYears),
        totalAreaAcres: Number(formData.totalAreaAcres),
      };

      const res = await farmerAPI.updateProfile(payload);
      if (res.success) {
        toast.success('Farm profile updated successfully!');
        if (res.farmer) updateFarmerProfileData(res.farmer);
      }
    } catch (error) {
      toast.error(error.message || 'Could not update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader message="Fetching your farm identity records..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#174D32]">Farm Profile & Verification</h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            This information is showcased on the public farmer directory and product cards.
          </p>
        </div>
        <div>
          <VerificationBadge status={formData.verificationStatus} />
        </div>
      </div>

      {formData.verificationStatus === 'REJECTED' && formData.rejectionReason && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
          <p className="font-bold">Admin Review Feedback:</p>
          <p>{formData.rejectionReason}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-[#BAD5C1]/60 shadow-xs space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Farm or Brand Name *
            </label>
            <input
              type="text"
              required
              value={formData.farmName}
              onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Farm Village / Town *
              </label>
              <input
                type="text"
                required
                value={formData.farmLocation}
                onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                District *
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">State *</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Farming Method *
              </label>
              <select
                value={formData.farmingMethod}
                onChange={(e) => setFormData({ ...formData, farmingMethod: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-[#BAD5C1] text-xs font-semibold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              >
                <option value="Organic Certified">Organic Certified</option>
                <option value="Natural / Permaculture">Natural / Permaculture</option>
                <option value="Hydroponic">Hydroponic</option>
                <option value="Conventional / Integrated">Conventional / Integrated</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Total Land (Acres)
              </label>
              <input
                type="number"
                min={0.1}
                step="any"
                value={formData.totalAreaAcres}
                onChange={(e) => setFormData({ ...formData, totalAreaAcres: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min={0}
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Crop Specialties (comma separated)
            </label>
            <input
              type="text"
              value={formData.cropTypes}
              onChange={(e) => setFormData({ ...formData, cropTypes: e.target.value })}
              placeholder="e.g. Vegetables, Table Grapes, A2 Ghee, Ancient Wheat"
              className="w-full px-4 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Farm Story & Natural Soil Practices
            </label>
            <textarea
              rows={4}
              value={formData.farmDescription}
              onChange={(e) => setFormData({ ...formData, farmDescription: e.target.value })}
              placeholder="Share how your farm works, soil treatment, and dedication to pure nutrition..."
              className="w-full p-3 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Profile Avatar Photo URL
              </label>
              <input
                type="url"
                value={formData.profileImage}
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#174D32] block mb-1">
                Farm Cover Landscape Photo URL
              </label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#BAD5C1]/30 flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={isSaving} icon={Save}>
            Save Farm Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FarmerProfile;

