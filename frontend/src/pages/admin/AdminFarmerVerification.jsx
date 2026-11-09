import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { VerificationBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { ShieldCheck, Check, X, FileText, MapPin, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminFarmerVerification = () => {
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');

  // Inspection modal
  const [inspectFarmer, setInspectFarmer] = useState(null);

  // Reject modal
  const [rejectFarmerTarget, setRejectFarmerTarget] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchFarmers = async () => {
    try {
      setIsLoading(true);
      const params = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const res = await adminAPI.getFarmers(params);
      if (res.success) {
        setFarmers(res.farmers || []);
      }
    } catch (error) {
      toast.error('Failed to load farmer applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, [statusFilter]);

  const handleApprove = async (farmerId) => {
    try {
      setIsProcessing(true);
      const res = await adminAPI.approveFarmer(farmerId);
      if (res.success) {
        toast.success(res.message);
        if (inspectFarmer?._id === farmerId) setInspectFarmer(null);
        fetchFarmers();
      }
    } catch (error) {
      toast.error(error.message || 'Approval failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectFarmerTarget) return;

    try {
      setIsProcessing(true);
      const res = await adminAPI.rejectFarmer(
        rejectFarmerTarget._id,
        rejectionReason || 'Documents or farm location could not be verified'
      );
      if (res.success) {
        toast.success(res.message);
        setRejectFarmerTarget(null);
        setRejectionReason('');
        if (inspectFarmer?._id === rejectFarmerTarget._id) setInspectFarmer(null);
        fetchFarmers();
      }
    } catch (error) {
      toast.error(error.message || 'Rejection failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#174D32]">
            Farmer Verification Management
          </h2>
          <p className="text-xs text-[#4A5B50] mt-0.5">
            Audit farmer applications, land documents, and approve marketplace selling rights.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#BAD5C1] text-xs font-bold text-[#174D32] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
          >
            <option value="PENDING">Pending Review</option>
            <option value="APPROVED">Approved Farmers</option>
            <option value="REJECTED">Rejected Applications</option>
            <option value="ALL">All Applications</option>
          </select>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchFarmers}>
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loader message="Loading verification records..." />
      ) : farmers.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No Applications Found"
          description={`There are currently no farmer applications with status "${statusFilter}".`}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-[#BAD5C1]/50 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#BAD5C1]/30 bg-[#F7F8EF]/60 text-[11px] font-bold uppercase tracking-wider text-[#78897E]">
                  <th className="py-3.5 px-5">Farm Name</th>
                  <th className="py-3.5 px-4">Farmer / Owner</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Method & Land</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#BAD5C1]/20">
                {farmers.map((farmer) => (
                  <tr key={farmer._id} className="hover:bg-[#F0F6F2]/30 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={farmer.profileImage || farmer.user?.avatar}
                          alt={farmer.farmName}
                          className="w-10 h-10 rounded-xl object-cover border border-[#BAD5C1]/40 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#174D32]">{farmer.farmName}</p>
                          <p className="text-[10px] text-[#78897E]">
                            Registered: {new Date(farmer.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#202B24]">{farmer.user?.name}</p>
                      <p className="text-[10px] text-[#78897E]">{farmer.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A5B50]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#63A66B]" />
                        {farmer.district}, {farmer.state}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#174D32]">{farmer.farmingMethod}</p>
                      <p className="text-[10px] text-[#78897E]">{farmer.totalAreaAcres || 5} Acres</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <VerificationBadge status={farmer.verificationStatus} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setInspectFarmer(farmer)}
                          icon={Eye}
                        >
                          Inspect
                        </Button>
                        {farmer.verificationStatus !== 'APPROVED' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleApprove(farmer._id)}
                            icon={Check}
                          >
                            Approve
                          </Button>
                        )}
                        {farmer.verificationStatus !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => setRejectFarmerTarget(farmer)}
                            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspection Modal */}
      <Modal
        isOpen={Boolean(inspectFarmer)}
        onClose={() => setInspectFarmer(null)}
        title="Inspect Farmer Application Dossier"
        maxWidth="max-w-2xl"
      >
        {inspectFarmer && (
          <div className="space-y-5 text-xs">
            <div className="flex items-center gap-4 pb-4 border-b border-[#BAD5C1]/30">
              <img
                src={inspectFarmer.profileImage || inspectFarmer.user?.avatar}
                alt={inspectFarmer.farmName}
                className="w-16 h-16 rounded-2xl object-cover border border-[#BAD5C1]/40"
              />
              <div>
                <h3 className="text-base font-extrabold text-[#174D32]">
                  {inspectFarmer.farmName}
                </h3>
                <p className="text-[#4A5B50] font-medium">
                  {inspectFarmer.user?.name} • {inspectFarmer.user?.email} • {inspectFarmer.user?.phone}
                </p>
                <div className="mt-1">
                  <VerificationBadge status={inspectFarmer.verificationStatus} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#174D32] uppercase tracking-wider block">
                Farm Bio & Agricultural Practice
              </span>
              <p className="text-[#4A5B50] leading-relaxed bg-[#F7F8EF] p-3 rounded-xl border border-[#BAD5C1]/30">
                {inspectFarmer.farmDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/40">
                <span className="text-[#78897E] block text-[11px]">Location</span>
                <span className="font-bold text-[#174D32]">
                  {inspectFarmer.farmLocation}, {inspectFarmer.district}, {inspectFarmer.state}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F0F6F2] border border-[#BAD5C1]/40">
                <span className="text-[#78897E] block text-[11px]">Total Land Area</span>
                <span className="font-bold text-[#174D32]">{inspectFarmer.totalAreaAcres || 5} Acres</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#174D32] uppercase tracking-wider block">
                Verification Documents
              </span>
              {inspectFarmer.documents && inspectFarmer.documents.length > 0 ? (
                <div className="space-y-1.5">
                  {inspectFarmer.documents.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F8EF] border border-[#BAD5C1]/40"
                    >
                      <span className="font-semibold text-[#174D32] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#63A66B]" />
                        {doc.docType}
                      </span>
                      <span className="text-[#78897E] text-[11px]">Verified Format</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#78897E] italic">Standard identity documents provided during registration.</p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#BAD5C1]/30 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setInspectFarmer(null)}
              >
                Close
              </Button>
              {inspectFarmer.verificationStatus !== 'APPROVED' && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isProcessing}
                  onClick={() => handleApprove(inspectFarmer._id)}
                  icon={Check}
                >
                  Approve Farmer
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Rejection Modal with Feedback */}
      <Modal
        isOpen={Boolean(rejectFarmerTarget)}
        onClose={() => setRejectFarmerTarget(null)}
        title="Reject Farmer Application"
      >
        <form onSubmit={handleRejectSubmit} className="space-y-4">
          <p className="text-xs text-[#4A5B50] leading-relaxed">
            Please state the audit rejection reason for{' '}
            <span className="font-bold text-[#174D32]">
              "{rejectFarmerTarget?.farmName}"
            </span>
            . This feedback will be sent directly to the farmer so they can correct their documents.
          </p>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Rejection Reason *
            </label>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Land record document was illegible. Please re-upload clear 7/12 extract..."
              className="w-full p-3 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-rose-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setRejectFarmerTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isProcessing}
            >
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFarmerVerification;

