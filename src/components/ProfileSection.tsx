import { useState, useRef, type ChangeEvent } from 'react';
import { Camera, RotateCcw, Shield, UserCheck, Sparkles } from 'lucide-react';

const DEFAULT_PORTRAIT_PATH =
  '/src/assets/images/chathuranga_profile_portrait_1795583462244.jpg';
const STORAGE_KEY = 'chathuranga_cyber_lab_profile_photo';

interface ProfileSectionProps {
  onReplaySplash?: () => void;
}

export function ProfileSection({ onReplaySplash }: ProfileSectionProps) {
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [imageError, setImageError] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePhotoSrc = customPhoto ?? DEFAULT_PORTRAIT_PATH;

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadNotice('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      if (!result) return;
      setImageError(false);
      setCustomPhoto(result);
      setUploadNotice('Profile photo updated.');
      try {
        window.localStorage.setItem(STORAGE_KEY, result);
      } catch {
        // Ignore storage quota errors
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleResetPhoto = () => {
    setCustomPhoto(null);
    setImageError(false);
    setUploadNotice(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage access errors
    }
  };

  return (
    <div className="space-y-5">
      <section
        aria-labelledby="profile-heading"
        className="rounded-2xl border border-[#143622] bg-[#07100b] p-5 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-[22px] border border-[#00ff66]/50 bg-[#040906]">
              {!imageError ? (
                <img
                  src={activePhotoSrc}
                  alt="Chathuranga profile portrait"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-[#040906] text-[#00ff66]">
                  <Shield className="h-8 w-8" aria-hidden="true" />
                  <span className="mt-1 font-mono-tech text-[10px]">
                    CHATHURANGA
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs text-[#00ff66]">
                <UserCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>APP CREATOR</span>
                <span className="text-[#275237]" aria-hidden="true">
                  ·
                </span>
                <span className="text-[#88bfa0]">CHATHURANGA CYBER LAB</span>
              </div>

              <h2
                id="profile-heading"
                className="mt-1.5 font-display text-xl sm:text-2xl font-bold text-[#e6f7ed]"
              >
                Chathuranga
              </h2>

              <p className="mt-1.5 max-w-xl text-sm text-[#9cc7ad] leading-relaxed">
                Welcome to Chathuranga Cyber Lab — your dark-mode Android security &amp; daily utility toolkit built for speed and privacy.
              </p>

              {uploadNotice && (
                <p role="status" className="mt-2 font-mono-tech text-xs text-[#00ff66]">
                  {uploadNotice}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col items-stretch sm:items-end gap-2 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              aria-label="Upload your profile photo"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#00ff66] px-4 py-2 font-mono-tech text-xs font-bold text-[#031208] hover:bg-[#2dff82] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{customPhoto ? 'Change My Photo' : 'Upload My Photo'}</span>
            </button>

            {customPhoto && (
              <button
                type="button"
                onClick={handleResetPhoto}
                className="min-h-[40px] inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#184028] bg-[#040906] px-3 py-1.5 font-mono-tech text-xs text-[#8ab89c] hover:text-[#00ff66] transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Reset Default</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* App Info List */}
      <section className="divide-y divide-[#11291b] overflow-hidden rounded-2xl border border-[#143622] bg-[#07100b]">
        <div className="flex items-center justify-between px-4 py-3.5 text-sm">
          <span className="text-[#8ab89c]">Application Name</span>
          <span className="font-mono-tech font-semibold text-[#e6f7ed]">
            Chathuranga Cyber Lab
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5 text-sm">
          <span className="text-[#8ab89c]">Installed Modules</span>
          <span className="font-mono-tech font-semibold text-[#00ff66] tabular-nums">
            5 Tools Active
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3.5 text-sm">
          <span className="text-[#8ab89c]">Startup Splash</span>
          <button
            type="button"
            onClick={onReplaySplash}
            className="inline-flex items-center gap-1.5 font-mono-tech text-xs font-semibold text-[#00ff66] hover:underline cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Replay Splash Screen</span>
          </button>
        </div>
      </section>
    </div>
  );
}
