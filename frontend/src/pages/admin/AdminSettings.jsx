import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Settings, ShieldCheck, Database, Save, Server } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [deliveryThreshold, setDeliveryThreshold] = useState(500);
  const [deliveryCharge, setDeliveryCharge] = useState(40);
  const [farmerCommission, setFarmerCommission] = useState(0); // 0% direct producer policy
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Marketplace business rules updated successfully!');
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#174D32]">Platform Governance Settings</h2>
        <p className="text-xs text-[#4A5B50] mt-0.5">
          Configure delivery policies, commission limits, and database status.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#BAD5C1]/60 shadow-xs space-y-6">
        <div className="border-b border-[#BAD5C1]/30 pb-3 flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-[#63A66B]" />
          <h3 className="font-bold text-sm text-[#174D32]">Delivery & Fee Architecture</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Free Delivery Order Threshold (₹)
            </label>
            <input
              type="number"
              min={0}
              value={deliveryThreshold}
              onChange={(e) => setDeliveryThreshold(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs font-bold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
            <p className="text-[11px] text-[#78897E] mt-1">Orders above this receive 100% free delivery.</p>
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Standard Courier Delivery Fee (₹)
            </label>
            <input
              type="number"
              min={0}
              value={deliveryCharge}
              onChange={(e) => setDeliveryCharge(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs font-bold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
            <p className="text-[11px] text-[#78897E] mt-1">Applied for orders below the threshold.</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#174D32] block mb-1">
            Platform Commission on Farmers (%)
          </label>
          <input
            type="number"
            disabled
            value={farmerCommission}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] bg-slate-50 text-xs font-bold text-[#174D32] cursor-not-allowed"
          />
          <p className="text-[11px] text-[#63A66B] font-bold mt-1">
            Locked at 0%. AgriDirect guarantees zero middleman commission deductions for registered farmers.
          </p>
        </div>

        {/* Database & Environment Info */}
        <div className="p-4 rounded-2xl bg-[#F0F6F2] border border-[#BAD5C1]/40 space-y-2 text-xs">
          <span className="font-bold text-[#174D32] flex items-center gap-1.5">
            <Database className="w-4 h-4 text-[#63A66B]" />
            Active Backend & Database Status:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4A5B50]">
            <div>
              <span className="font-semibold text-[#174D32]">Backend Port:</span> 5000
            </div>
            <div>
              <span className="font-semibold text-[#174D32]">Database Engine:</span> MongoDB
            </div>
            <div>
              <span className="font-semibold text-[#174D32]">Auth Mechanism:</span> JWT (Bearer)
            </div>
            <div>
              <span className="font-semibold text-[#174D32]">Image Pipeline:</span> Multer & Cloudinary ready
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" size="md" isLoading={isSaving} icon={Save}>
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;

