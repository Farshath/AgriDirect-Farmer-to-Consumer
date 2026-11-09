import React from 'react';
import { Sprout } from 'lucide-react';

export const Loader = ({ message = 'Loading harvest...', size = 'md' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 gap-3">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#BAD5C1] border-t-[#174D32] animate-spin" />
        <Sprout className="w-5 h-5 text-[#63A66B] absolute animate-pulse" />
      </div>
      {message && (
        <p className="text-sm font-medium text-[#4A5B50] tracking-wide animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#BAD5C1]/40 animate-pulse space-y-4">
      <div className="w-full h-48 bg-slate-200 rounded-xl" />
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-slate-200 rounded w-1/4" />
        <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
      </div>
    </div>
  );
};

export default Loader;

