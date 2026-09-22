import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, X, Check, KeyRound, ShieldAlert, Loader2 } from 'lucide-react';
import { loginAdmin, changeAdminPassword } from './adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Password change sub-view states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور (Password required).');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginAdmin(password);
      if (result.success) {
        onLoginSuccess();
        onClose();
        setPassword('');
      } else {
        setError(result.error || 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
      }
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من الخادم.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword.trim()) {
      setError('يرجى إدخال كلمة المرور الحالية.');
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
      const result = await changeAdminPassword(currentPassword, newPassword);
      if (result.success) {
        setPasswordChangeSuccess(true);
        setError(null);
        setTimeout(() => {
          setIsChangingPassword(false);
          setPasswordChangeSuccess(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPassword('');
        }, 2200);
      } else {
        setError(result.error || 'تعذر تغيير كلمة المرور. تأكد من صحة كلمة المرور الحالية.');
      }
    } catch {
      setError('حدث خطأ أثناء تحديث كلمة المرور.');
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
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4c59d]/30 bg-[#0a0a0a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#d4c59d]/10 border border-[#d4c59d]/40 flex items-center justify-center text-[#d4c59d]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base font-bold text-[#f5f0e6]">
                {isChangingPassword ? 'Change Admin Password' : 'Admin Portal Access'}
              </h3>
              <p className="text-[11px] text-[#d4c59d] font-arabic">
                {isChangingPassword ? 'تغيير كلمة مرور الإدارة' : 'دخول لوحة تحكم المسؤول (تراث)'}
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

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {!isChangingPassword ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d] flex items-center justify-between">
                  <span>Enter Admin Password</span>
                  <span className="text-[11px] font-arabic font-normal text-[#9e9174]">
                    أدخل كلمة المرور
                  </span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    autoFocus
                    disabled={isSubmitting}
                    className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] transition-colors disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9174] hover:text-[#f5f0e6]"
                    title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2 font-arabic">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(true);
                    setError(null);
                  }}
                  className="text-xs text-[#9e9174] hover:text-[#d4c59d] transition-colors inline-flex items-center gap-1 font-arabic"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>تغيير كلمة المرور</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg bg-[#141414] border border-[#d4c59d]/30 text-xs font-bold uppercase tracking-wider text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
                  >
                    Cancel
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
                    <span>Login (دخول)</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
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
                    className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9174] hover:text-[#f5f0e6]"
                    title={showCurrent ? 'إخفاء' : 'إظهار'}
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
                    className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9174] hover:text-[#f5f0e6]"
                    title={showNew ? 'إخفاء' : 'إظهار'}
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
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
                    className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9174] hover:text-[#f5f0e6]"
                    title={showConfirm ? 'إخفاء' : 'إظهار'}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordChangeSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 font-arabic">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>تم حفظ كلمة المرور بنجاح! يمكنك الآن الدخول بكلمة المرور الجديدة.</span>
                </div>
              )}

              {error && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2 font-arabic">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setIsChangingPassword(false);
                      setError(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#141414] border border-[#d4c59d]/30 text-xs font-bold uppercase tracking-wider text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
                  >
                    رجوع
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>حفظ كلمة المرور</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
