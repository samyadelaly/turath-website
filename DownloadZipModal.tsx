import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Download, 
  ExternalLink, 
  FolderArchive, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileCode, 
  Sparkles,
  Layers,
  Terminal,
  Copy,
  Check
} from 'lucide-react';

interface DownloadZipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadZipModal: React.FC<DownloadZipModalProps> = ({ isOpen, onClose }) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  // Compute absolute URL to ensure new tab opens the exact origin URL outside iframe
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const directZipUrl = `${currentOrigin}/turath-website.zip`;
  const flatZipUrl = `${currentOrigin}/turath-flat.zip`;
  const apiZipUrl = `${currentOrigin}/api/download-flat-zip`;

  const copyToClipboard = (url: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(label);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  const handleBlobDownload = async (filename: string = 'turath-website.zip') => {
    setDownloadStatus('loading');
    setErrorMessage('');

    try {
      // Add timestamp query param to bypass any stale browser caching
      const response = await fetch(`/${filename}?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`تعذر استلام الملف (رمز الخطأ ${response.status})`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('الملف المستلم فارغ');
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 2000);

      setDownloadStatus('success');
    } catch (err) {
      console.error('Download error:', err);
      setDownloadStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الملف');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl bg-[#000000] border-2 border-[#d4c59d] rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0a0a0a] border-b border-[#d4c59d]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#d4c59d]/10 border border-[#d4c59d] flex items-center justify-center text-[#d4c59d]">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#f5f0e6] font-serif-luxury">
                تحميل ملفات موقع تُراث (ZIP)
              </h3>
              <p className="text-[11px] text-[#9e9174]">
                Turath Handcrafted Brass Website • Source Code & Assets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9e9174] hover:text-[#d4c59d] hover:bg-[#161616] transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-right" dir="rtl">
          {/* File Overview Card */}
          <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#d4c59d]/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#d4c59d] text-black">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#f5f0e6]">turath-website.zip (النسخة المسطحة - Flat Structure)</div>
                <div className="text-xs text-[#9e9174] mt-0.5">بدون مجلدات فرعية تماماً • 55 ملفاً في الجذر • جاهزة للرفع المباشر إلى GitHub و Vercel</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#d4c59d]/20 text-[#d4c59d] text-xs font-bold font-mono">
              Flat / جاهز
            </span>
          </div>

          {/* Download Method 1: Primary in-app blob download */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-[#d4c59d] block">
              1. التحميل المباشر بنقرة واحدة:
            </label>
            <button
              onClick={() => handleBlobDownload('turath-website.zip')}
              disabled={downloadStatus === 'loading'}
              className="gold-shimmer-hover w-full py-3.5 px-5 rounded-lg bg-[#d4c59d] text-[#000000] font-bold text-sm tracking-wide hover:bg-[#e6d8b5] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {downloadStatus === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري استلام وضغط الملف...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تحميل الملف الآن (turath-website.zip)</span>
                </>
              )}
            </button>

            {downloadStatus === 'success' && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تم بدء التحميل بنجاح! تفقد مجلد التنزيلات (Downloads) في جهازك.</span>
              </div>
            )}

            {downloadStatus === 'error' && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage || 'تعذر التحميل عبر المعاينة.'} استخدم زر الفتح في نافذة جديدة أدناه.</span>
              </div>
            )}
          </div>

          {/* Download Method 2: Open in new tab (bypasses iframe sandbox) */}
          <div className="space-y-3 pt-3 border-t border-[#d4c59d]/20">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#d4c59d] block">
                2. فتح رابط التنزيل في علامة تبويب جديدة (إذا حجب المتصفح التحميل):
              </label>
              <p className="text-[11px] text-[#9e9174]">
                في بعض المتصفحات، تمنع نافذة المعاينة المدمجة التحميل التلقائي. الضغط هنا يفتح الرابط خارج المعاينة مباشرة.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1">
                <a
                  href={directZipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="turath-website.zip"
                  className="py-2.5 px-3 rounded-lg bg-[#161616] border border-[#d4c59d] text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">رابط مباشر 1 (.zip)</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(directZipUrl, 'link1')}
                  className="py-1 px-2 rounded bg-[#111111] border border-[#d4c59d]/20 text-[#9e9174] hover:text-[#f5f0e6] transition-colors text-[10px] flex items-center justify-center gap-1"
                >
                  {copiedLink === 'link1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink === 'link1' ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <a
                  href={flatZipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="turath-flat.zip"
                  className="py-2.5 px-3 rounded-lg bg-[#161616] border border-[#d4c59d]/60 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">رابط مباشر 2 (Flat)</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(flatZipUrl, 'link2')}
                  className="py-1 px-2 rounded bg-[#111111] border border-[#d4c59d]/20 text-[#9e9174] hover:text-[#f5f0e6] transition-colors text-[10px] flex items-center justify-center gap-1"
                >
                  {copiedLink === 'link2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink === 'link2' ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <a
                  href={apiZipUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="turath-website.zip"
                  className="py-2.5 px-3 rounded-lg bg-[#161616] border border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-[#000000] transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">رابط API (Stream)</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(apiZipUrl, 'link3')}
                  className="py-1 px-2 rounded bg-[#111111] border border-[#d4c59d]/20 text-[#9e9174] hover:text-[#f5f0e6] transition-colors text-[10px] flex items-center justify-center gap-1"
                >
                  {copiedLink === 'link3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink === 'link3' ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Instructions for running the site locally */}
          <div className="p-4 rounded-xl bg-[#090909] border border-[#d4c59d]/20 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#d4c59d] font-bold">
              <Terminal className="w-4 h-4" />
              <span>كيفية تشغيل الموقع على جهازك بعد فك الضغط:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#b8ab8c] text-[11px] leading-relaxed">
              <li>فك ضغط ملف <code className="text-[#f5f0e6] bg-[#1a1a1a] px-1 rounded">turath-website.zip</code> في أي مجلد.</li>
              <li>افتح موجه الأوامر (Terminal) داخل المجلد ونفذ: <code className="text-[#f5f0e6] bg-[#1a1a1a] px-1 rounded">npm install</code></li>
              <li>شغّل الموقع بأمر: <code className="text-[#f5f0e6] bg-[#1a1a1a] px-1 rounded">npm run dev</code></li>
            </ol>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#0a0a0a] border-t border-[#d4c59d]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#161616] border border-[#d4c59d]/40 text-[#d4c59d] hover:bg-[#d4c59d] hover:text-black transition-colors text-xs font-bold"
          >
            إغلاق النافذة
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
