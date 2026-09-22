import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, Eye, EyeOff, X, Check, ShieldAlert, Loader2 } from 'lucide-react';
import { changeAdminPassword } from './adminAuth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPasswordChanged?: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onPasswordChanged,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!currentPassword.trim()) {
      setError('يرجى إدخال كلمة المرور الحالية (Current password is required).');
      return;
    }

    if (newPassword.trim().length < 6) {
      setError('كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف أو أرقام.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقين.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changeAdminPassword(currentPassword, newPassword);
      if (res.success) {
        setSuccessMessage('تم تحديث كلمة المرور بنجاح! سيتم تحويلك لتسجيل الدخول.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          onPasswordChanged?.();
          onClose();
        }, 1800);
      } else {
        setError(res.error || 'تعذر تغيير كلمة المرور. تأكد من صحة كلمة المرور الحالية.');
      }
    } catch {
      setError('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md bg-[#000000] border border-[#d4c59d] rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4c59d]/30 bg-[#0a0a0a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4c59d]/10 border border-[#d4c59d]/40 flex items-center justify-center text-[#d4c59d]">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-[#f5f0e6]">
                Change Admin Password
              </h3>
              <p className="text-[11px] text-[#d4c59d] font-arabic">
                تغيير كلمة مرور الإدارة وحمايتها
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#f5f0e6] hover:bg-[#141414] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center justify-between">
                <span>Current Password</span>
                <span className="text-[11px] font-arabic font-normal text-[#9e9174]">
                  كلمة المرور الحالية
                </span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9174] hover:text-[#f5f0e6]"
                  title={showCurrent ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center justify-between">
                <span>New Password (min 6 chars)</span>
                <span className="text-[11px] font-arabic font-normal text-[#9e9174]">
                  كلمة المرور الجديدة
                </span>
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9174] hover:text-[#f5f0e6]"
                  title={showNew ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center justify-between">
                <span>Confirm New Password</span>
                <span className="text-[11px] font-arabic font-normal text-[#9e9174]">
                  تأكيد كلمة المرور الجديدة
                </span>
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9174] hover:text-[#f5f0e6]"
                  title={showConfirm ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {successMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 font-arabic">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2 font-arabic">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#141414] border border-[#d4c59d]/30 text-xs font-bold uppercase tracking-wider text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>حفظ كلمة المرور</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};
