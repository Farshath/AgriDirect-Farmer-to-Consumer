import React, { useState } from 'react';
import { authAPI } from '../../api';
import Button from '../../components/common/Button';
import { Lock, ShieldCheck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsChanging(true);
      const res = await authAPI.changePassword({ currentPassword, newPassword });
      if (res.success) {
        toast.success('Security password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error(error.message || 'Could not update password');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#174D32]">Account & Security Settings</h2>
        <p className="text-xs text-[#4A5B50] mt-0.5">
          Manage your credentials, login access, and farm contact settings.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#BAD5C1]/60 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#BAD5C1]/30">
          <div className="w-8 h-8 rounded-xl bg-[#DCEADF] text-[#174D32] flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-[#174D32]">Change Password</h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              New Password (min 6 characters) *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#174D32] block mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#BAD5C1] text-xs text-[#202B24] focus:outline-none focus:ring-2 focus:ring-[#174D32]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isChanging}
            >
              Update Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerSettings;

