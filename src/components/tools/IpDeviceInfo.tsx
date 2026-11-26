import { useState, useEffect, useCallback } from 'react';
import { Wifi, Smartphone, RefreshCw, Copy, Check, Globe } from 'lucide-react';

interface NetworkInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  source: string;
}

export function IpDeviceInfo() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [loadingIp, setLoadingIp] = useState(true);
  const [ipError, setIpError] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  const fetchIpInfo = useCallback(async () => {
    setLoadingIp(true);
    setIpError(null);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.ip) {
          setNetworkInfo({
            ip: data.ip,
            city: data.city,
            region: data.region,
            country: data.country_name,
            org: data.org,
            source: 'ipapi.co',
          });
          window.clearTimeout(timeoutId);
          setLoadingIp(false);
          return;
        }
      }
      throw new Error('Primary IP lookup unavailable');
    } catch {
      try {
        const fallbackRes = await fetch('https://api.ipify.org?format=json', {
          signal: controller.signal,
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setNetworkInfo({
            ip: fallbackData.ip,
            source: 'ipify.org',
          });
        } else {
          setIpError('Unable to reach public IP lookup service.');
        }
      } catch {
        setIpError('Public IP lookup blocked or offline.');
      }
    } finally {
      window.clearTimeout(timeoutId);
      setLoadingIp(false);
    }
  }, []);

  useEffect(() => {
    fetchIpInfo();
  }, [fetchIpInfo]);

  const nav = window.navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; downlink?: number };
  };

  const deviceSpecs = [
    { label: 'Operating Platform', value: nav.platform || 'Unknown' },
    { label: 'Language', value: nav.language || 'en-US' },
    {
      label: 'Timezone',
      value: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    },
    {
      label: 'Screen Resolution',
      value: `${window.screen.width} × ${window.screen.height}`,
    },
    {
      label: 'Viewport Size',
      value: `${window.innerWidth} × ${window.innerHeight}`,
    },
    {
      label: 'Pixel Density',
      value: `${window.devicePixelRatio}x`,
    },
    {
      label: 'CPU Threads',
      value: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} cores` : 'Protected',
    },
    {
      label: 'Approx. RAM',
      value: nav.deviceMemory ? `${nav.deviceMemory} GB` : 'Protected',
    },
    {
      label: 'Connection Type',
      value: nav.connection?.effectiveType
        ? `${nav.connection.effectiveType.toUpperCase()}${nav.connection.downlink ? ` (~${nav.connection.downlink} Mbps)` : ''}`
        : nav.onLine
          ? 'Online'
          : 'Offline',
    },
    {
      label: 'Touch Support',
      value: nav.maxTouchPoints > 0 ? `Yes (${nav.maxTouchPoints} points)` : 'Desktop Pointer',
    },
  ];

  const handleCopyReport = async () => {
    const lines = [
      '=== CHATHURANGA CYBER LAB - DEVICE & IP REPORT ===',
      `Public IP: ${networkInfo?.ip ?? 'Unavailable'}`,
      networkInfo?.city ? `Location: ${networkInfo.city}, ${networkInfo.country}` : '',
      networkInfo?.org ? `ISP / Org: ${networkInfo.org}` : '',
      ...deviceSpecs.map((s) => `${s.label}: ${s.value}`),
      `User Agent: ${nav.userAgent}`,
    ].filter(Boolean);

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedReport(true);
      window.setTimeout(() => setCopiedReport(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="space-y-5">
      {/* Public IP Card */}
      <section className="rounded-2xl border border-[#143622] bg-[#07100b] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Globe className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[#e6f7ed]">
              Public IP &amp; Network
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchIpInfo}
              disabled={loadingIp}
              className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl border border-[#184028] bg-[#040906] px-3.5 py-2 font-mono-tech text-xs font-semibold text-[#00ff66] hover:border-[#00ff66]/50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loadingIp ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReport}
              className="min-h-[42px] inline-flex items-center gap-1.5 rounded-xl bg-[#00ff66] px-3.5 py-2 font-mono-tech text-xs font-bold text-[#031208] hover:bg-[#2dff82] transition-colors cursor-pointer"
            >
              {copiedReport ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copied Report</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Copy Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[#00ff66]/30 bg-[#040906] p-4">
          {loadingIp ? (
            <p className="font-mono-tech text-sm text-[#7cb08f]">
              Querying public network address...
            </p>
          ) : ipError ? (
            <p className="font-mono-tech text-sm text-[#facc15]">{ipError}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="font-mono-tech text-[11px] text-[#6d9e80]">
                  PUBLIC IP ADDRESS
                </p>
                <p className="mt-1 font-mono-tech text-lg sm:text-xl font-bold text-[#00ff66] tabular-nums">
                  {networkInfo?.ip}
                </p>
              </div>
              <div>
                <p className="font-mono-tech text-[11px] text-[#6d9e80]">
                  APPROX. LOCATION
                </p>
                <p className="mt-1 text-sm font-semibold text-[#e6f7ed]">
                  {networkInfo?.city
                    ? `${networkInfo.city}, ${networkInfo.country ?? ''}`
                    : 'Not disclosed'}
                </p>
              </div>
              <div>
                <p className="font-mono-tech text-[11px] text-[#6d9e80]">
                  ISP / NETWORK
                </p>
                <p className="mt-1 text-sm font-semibold text-[#e6f7ed] truncate">
                  {networkInfo?.org || 'Standard ISP'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Hardware & Browser Telemetry */}
      <section className="rounded-2xl border border-[#143622] bg-[#07100b] p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <Smartphone className="h-5 w-5 text-[#00ff66]" aria-hidden="true" />
          <h3 className="font-display text-base sm:text-lg font-bold text-[#e6f7ed]">
            Device &amp; Browser Fingerprint
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {deviceSpecs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-xl border border-[#11291b] bg-[#040906] px-3.5 py-3"
            >
              <p className="font-mono-tech text-[11px] text-[#6e9e81]">
                {spec.label}
              </p>
              <p className="mt-1 font-mono-tech text-sm font-semibold text-[#e6f7ed] tabular-nums break-words">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#11291b] bg-[#040906] p-3.5">
          <div className="flex items-center gap-2 font-mono-tech text-[11px] text-[#6e9e81]">
            <Wifi className="h-3.5 w-3.5 text-[#00ff66]" aria-hidden="true" />
            <span>USER AGENT STRING</span>
          </div>
          <p className="mt-1.5 font-mono-tech text-xs text-[#9ed0b1] break-all leading-relaxed">
            {nav.userAgent}
          </p>
        </div>
      </section>
    </div>
  );
}
