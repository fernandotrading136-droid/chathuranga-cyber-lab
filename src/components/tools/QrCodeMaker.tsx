import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Copy, Check } from 'lucide-react';

type QrPreset = 'url' | 'text' | 'wifi';
type QrTheme = 'scan-safe' | 'neon-hacker';

export function QrCodeMaker() {
  const [preset, setPreset] = useState<QrPreset>('url');
  const [content, setContent] = useState('https://chathuranga-cyber-lab.app');
  const [wifiSsid, setWifiSsid] = useState('CyberLab_5G');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [qrTheme, setQrTheme] = useState<QrTheme>('scan-safe');
  const [qrSize, setQrSize] = useState<256 | 512 | 1024>(512);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrError, setQrError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const effectivePayload =
    preset === 'wifi'
      ? `WIFI:T:${wifiSecurity};S:${wifiSsid};P:${wifiSecurity === 'nopass' ? '' : wifiPassword};;`
      : content.trim();

  useEffect(() => {
    let active = true;
    if (!effectivePayload) {
      setQrDataUrl('');
      setQrError(null);
      return;
    }

    const darkColor = qrTheme === 'neon-hacker' ? '#00ff66' : '#050a07';
    const lightColor = qrTheme === 'neon-hacker' ? '#050a07' : '#ffffff';

    QRCode.toDataURL(effectivePayload, {
      width: qrSize,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((url) => {
        if (active) {
          setQrDataUrl(url);
          setQrError(null);
        }
      })
      .catch(() => {
        if (active) {
          setQrError('Unable to generate QR code for this input.');
        }
      });

    return () => {
      active = false;
    };
  }, [effectivePayload, qrTheme, qrSize]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `chathuranga-cyber-lab-qr-${qrSize}px.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPayload = async () => {
    if (!effectivePayload) return;
    try {
      await navigator.clipboard.writeText(effectivePayload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Controls */}
      <section className="lg:col-span-7 rounded-2xl border border-[#143622] bg-[#07100b] p-4 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5">
          <QrCode className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
          <h2 className="font-display text-lg font-bold text-[#e6f7ed]">
            QR Code Maker
          </h2>
        </div>

        {/* Preset Switcher */}
        <div
          role="group"
          aria-label="QR code input mode"
          className="grid grid-cols-3 gap-2 rounded-xl border border-[#122b1c] bg-[#040906] p-1"
        >
          {[
            { id: 'url' as const, label: 'URL / Link' },
            { id: 'text' as const, label: 'Plain Text' },
            { id: 'wifi' as const, label: 'Wi-Fi Login' },
          ].map((item) => {
            const active = preset === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPreset(item.id)}
                className={`min-h-[42px] rounded-lg px-2 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#00ff66] text-[#031208]'
                    : 'text-[#8ab89c] hover:text-[#e6f7ed]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Input Fields */}
        {preset === 'wifi' ? (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="wifi-ssid"
                className="block text-xs font-medium text-[#98c7ab] mb-1.5"
              >
                Wi-Fi Network Name (SSID)
              </label>
              <input
                id="wifi-ssid"
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="Enter Wi-Fi name"
                className="min-h-[46px] w-full rounded-xl border border-[#163823] bg-[#040906] px-3.5 py-2.5 text-sm text-[#e6f7ed] focus:border-[#00ff66] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="wifi-security"
                  className="block text-xs font-medium text-[#98c7ab] mb-1.5"
                >
                  Security Type
                </label>
                <select
                  id="wifi-security"
                  value={wifiSecurity}
                  onChange={(e) =>
                    setWifiSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')
                  }
                  className="min-h-[46px] w-full rounded-xl border border-[#163823] bg-[#040906] px-3 py-2.5 text-sm text-[#e6f7ed] focus:border-[#00ff66] focus:outline-none"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password</option>
                </select>
              </div>

              {wifiSecurity !== 'nopass' && (
                <div>
                  <label
                    htmlFor="wifi-pass"
                    className="block text-xs font-medium text-[#98c7ab] mb-1.5"
                  >
                    Wi-Fi Password
                  </label>
                  <input
                    id="wifi-pass"
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Enter network password"
                    className="min-h-[46px] w-full rounded-xl border border-[#163823] bg-[#040906] px-3.5 py-2.5 text-sm text-[#e6f7ed] focus:border-[#00ff66] focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="qr-text-input"
              className="block text-xs font-medium text-[#98c7ab] mb-1.5"
            >
              {preset === 'url' ? 'Website URL' : 'Message or Text'}
            </label>
            <textarea
              id="qr-text-input"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                preset === 'url'
                  ? 'https://example.com'
                  : 'Enter any text to encode...'
              }
              className="w-full rounded-xl border border-[#163823] bg-[#040906] p-3.5 text-sm text-[#e6f7ed] placeholder-[#558066] focus:border-[#00ff66] focus:outline-none"
            />
          </div>
        )}

        {/* Style & Resolution Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="block text-xs font-medium text-[#98c7ab] mb-1.5">
              Color Style
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQrTheme('scan-safe')}
                className={`min-h-[42px] rounded-xl border px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                  qrTheme === 'scan-safe'
                    ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66]'
                    : 'border-[#122b1c] bg-[#040906] text-[#8ab89c]'
                }`}
              >
                Classic White
              </button>
              <button
                type="button"
                onClick={() => setQrTheme('neon-hacker')}
                className={`min-h-[42px] rounded-xl border px-3 py-2 text-xs font-medium cursor-pointer transition-colors ${
                  qrTheme === 'neon-hacker'
                    ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66]'
                    : 'border-[#122b1c] bg-[#040906] text-[#8ab89c]'
                }`}
              >
                Neon Green
              </button>
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-[#98c7ab] mb-1.5">
              Export Size
            </span>
            <div className="grid grid-cols-3 gap-2">
              {([256, 512, 1024] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setQrSize(sz)}
                  className={`min-h-[42px] rounded-xl border px-2 py-2 font-mono-tech text-xs font-medium cursor-pointer transition-colors tabular-nums ${
                    qrSize === sz
                      ? 'border-[#00ff66] bg-[#00ff66]/15 text-[#00ff66]'
                      : 'border-[#122b1c] bg-[#040906] text-[#8ab89c]'
                  }`}
                >
                  {sz}px
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live QR Output Card */}
      <section className="lg:col-span-5 rounded-2xl border border-[#143622] bg-[#07100b] p-4 sm:p-6 flex flex-col items-center text-center space-y-4">
        <h3 className="font-display text-base font-bold text-[#e6f7ed]">
          Live QR Preview
        </h3>

        <div className="flex h-60 w-60 items-center justify-center rounded-2xl border border-[#173d27] bg-[#040906] p-3">
          {qrError ? (
            <p className="text-xs text-[#ff4d6d]">{qrError}</p>
          ) : qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Generated QR code"
              className="h-full w-full rounded-xl object-contain"
            />
          ) : (
            <p className="text-xs text-[#69967a]">
              Enter text or URL above to generate QR code
            </p>
          )}
        </div>

        <div className="w-full grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={!effectivePayload}
            onClick={handleCopyPayload}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl border border-[#1a442b] bg-[#040906] px-4 py-2 font-mono-tech text-xs font-semibold text-[#e6f7ed] hover:border-[#00ff66]/50 disabled:opacity-40 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#00ff66]" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#00ff66]" aria-hidden="true" />
                <span>Copy Data</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={!qrDataUrl}
            onClick={handleDownload}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#00ff66] px-4 py-2 font-mono-tech text-xs font-bold text-[#031208] hover:bg-[#2dff82] disabled:opacity-40 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Save PNG</span>
          </button>
        </div>
      </section>
    </div>
  );
}
