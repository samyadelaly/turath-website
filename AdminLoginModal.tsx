import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Eye, EyeOff, X, Check, KeyRound, ShieldAlert, Sparkles } from 'lucide-react';
import { verifyAdminPassword, setAdminLoggedIn, setCustomAdminPassword, DEFAULT_ADMIN_PASSWORD } from './adminAuth';

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
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verifyAdminPassword(password)) {
      setAdminLoggedIn(true);
      onLoginSuccess();
      onClose();
    } else {
      setError('كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyAdminPassword(password)) {
      setError('كلمة المرور الحالية غير صحيحة.');
      return;
    }
    if (newPassword.trim().length < 4) {
      setError('كلمة المرور الجديدة يجب أن لا تقل عن 4 خانات.');
      return;
    }
    if (setCustomAdminPassword(newPassword.trim())) {
      setPasswordChangeSuccess(true);
      setError(null);
      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordChangeSuccess(false);
        setPassword(newPassword.trim());
      }, 1500);
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
                    placeholder="Enter password..."
                    autoFocus
                    className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg pl-3.5 pr-10 py-2.5 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9e9174] hover:text-[#f5f0e6]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password hint for convenience */}
              <div className="p-2.5 rounded-lg bg-[#0c0c0c] border border-[#d4c59d]/20 text-[11px] text-[#9e9174] flex items-center justify-between">
                <span>Default password is: <strong className="text-[#d4c59d] font-mono">{DEFAULT_ADMIN_PASSWORD}</strong> (or turath123)</span>
                <Sparkles className="w-3.5 h-3.5 text-[#d4c59d]" />
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
                  onClick={() => setIsChangingPassword(true)}
                  className="text-xs text-[#9e9174] hover:text-[#d4c59d] transition-colors inline-flex items-center gap-1 font-arabic"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>تغيير كلمة المرور</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-[#141414] border border-[#d4c59d]/30 text-xs font-bold uppercase tracking-wider text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow"
                  >
                    <Check className="w-4 h-4" />
                    <span>Login (دخول)</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                  Current Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#d4c59d]">
                  New Password (min 4 characters)
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password..."
                  className="w-full bg-[#111111] border border-[#d4c59d]/40 rounded-lg px-3.5 py-2 text-sm text-[#f5f0e6] focus:outline-none focus:border-[#d4c59d]"
                />
              </div>

              {passwordChangeSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>تم تغيير كلمة المرور بنجاح!</span>
                </div>
              )}

              {error && (
                <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300">
                  {error}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#141414] border border-[#d4c59d]/30 text-xs font-bold uppercase tracking-wider text-[#9e9174] hover:text-[#f5f0e6] transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#d4c59d] text-[#000000] text-xs font-bold uppercase tracking-wider hover:bg-[#e6d8b5] transition-all shadow"
                >
                  Save New Password
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
