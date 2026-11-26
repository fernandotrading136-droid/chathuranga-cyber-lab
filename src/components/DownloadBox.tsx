import { useState } from 'react';
import {
  Database,
  Download,
  FileText,
  BookA,
  CheckCircle2,
  Eye,
  X,
} from 'lucide-react';
import { buildCyberWordsText, buildSession1NotesText } from '../data/cyberData';

export function DownloadBox() {
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<'notes' | 'words' | null>(null);

  const triggerDownload = (filename: string, content: string, label: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setLastDownloaded(label);
  };

  const handleDownloadNotes = () => {
    triggerDownload(
      'Chathuranga_Cyber_Lab_Session_1_Notes.txt',
      buildSession1NotesText(),
      'Session 1 Notes'
    );
  };

  const handleDownloadWords = () => {
    triggerDownload(
      'Chathuranga_Cyber_Lab_Cyber_Words.txt',
      buildCyberWordsText(),
      'Cyber Words'
    );
  };

  return (
    <section
      aria-labelledby="download-heading"
      className="flex flex-col justify-between rounded-lg border border-[#00f0ff]/30 bg-[#070c10] p-4 sm:p-6 shadow-[0_0_30px_rgba(0,240,255,0.06)]"
    >
      <div>
        {/* Box Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#142630] pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="h-5 w-5 text-[#00f0ff]" aria-hidden="true" />
            <h2
              id="download-heading"
              className="font-mono-tech text-sm sm:text-base font-bold tracking-wider text-[#00f0ff]"
            >
              DOWNLOAD DATA
            </h2>
          </div>
          <span className="font-mono-tech text-xs text-[#7fa6b8]">
            FREE STUDY PACKS
          </span>
        </div>

        <p className="mt-4 text-sm text-[#b7d3e0] leading-relaxed">
          ඔබට Offline ඉගෙන ගැනීම සඳහා Session 1 සටහන් සහ Cyber Security වචන මාලාව නොමිලේ Download කරගත හැක.
        </p>

        {/* Download Item 1: Session 1 Notes */}
        <div className="mt-4 space-y-3">
          <div className="rounded-md border border-[#142a36] bg-[#040709] p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <FileText
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#00ff66]"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-semibold text-[#e8f6fc]">
                    Session 1 Notes (සිංහල + English)
                  </h3>
                  <p className="mt-0.5 text-xs text-[#89aebf]">
                    Strong passwords, 2FA, Phishing ආරක්ෂාව සහ මූලික නීති 5.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPreviewDoc(previewDoc === 'notes' ? null : 'notes')
                }
                className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 font-mono-tech text-xs text-[#9cc0d0] hover:bg-[#0d1c24] hover:text-[#00f0ff] transition-colors cursor-pointer shrink-0"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{previewDoc === 'notes' ? 'Hide' : 'Preview'}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleDownloadNotes}
              className="mt-3 w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-md border border-[#00ff66]/50 bg-[#00ff66]/10 px-4 py-2 font-mono-tech text-sm font-semibold text-[#00ff66] hover:bg-[#00ff66]/20 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00ff66]"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Download Session 1 Notes</span>
            </button>
          </div>

          {/* Download Item 2: Cyber Words */}
          <div className="rounded-md border border-[#142a36] bg-[#040709] p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <BookA
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#00f0ff]"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-sm font-semibold text-[#e8f6fc]">
                    Cyber Words Glossary (වචන මාලාව)
                  </h3>
                  <p className="mt-0.5 text-xs text-[#89aebf]">
                    Phishing, Malware, Firewall, VPN ඇතුළු වචන 12ක සරල අර්ථ.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPreviewDoc(previewDoc === 'words' ? null : 'words')
                }
                className="inline-flex items-center gap-1 rounded px-2.5 py-1.5 font-mono-tech text-xs text-[#9cc0d0] hover:bg-[#0d1c24] hover:text-[#00f0ff] transition-colors cursor-pointer shrink-0"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{previewDoc === 'words' ? 'Hide' : 'Preview'}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleDownloadWords}
              className="mt-3 w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-md border border-[#00f0ff]/60 bg-[#00f0ff]/10 px-4 py-2 font-mono-tech text-sm font-semibold text-[#00f0ff] hover:bg-[#00f0ff]/20 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00f0ff]"
            >
              <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Download Cyber Words</span>
            </button>
          </div>
        </div>

        {/* Inline Preview Drawer */}
        {previewDoc && (
          <div className="mt-3 rounded-md border border-[#1a3747] bg-[#030507] p-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#11232d]">
              <span className="font-mono-tech text-xs font-semibold text-[#00f0ff]">
                {previewDoc === 'notes'
                  ? 'Session_1_Notes.txt Preview'
                  : 'Cyber_Words.txt Preview'}
              </span>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                aria-label="Close preview"
                className="rounded p-1 text-[#7fa6b8] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <pre className="mt-2 max-h-44 overflow-y-auto whitespace-pre-wrap font-mono-tech text-[11px] leading-relaxed text-[#b7d3e0]">
              {previewDoc === 'notes'
                ? buildSession1NotesText()
                : buildCyberWordsText()}
            </pre>
          </div>
        )}
      </div>

      {/* Download Confirmation Banner */}
      <div className="mt-4 min-h-[28px] flex items-center">
        {lastDownloaded ? (
          <p
            role="status"
            className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#00ff66]"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Downloaded: {lastDownloaded} (.txt)</span>
          </p>
        ) : (
          <p className="font-mono-tech text-xs text-[#698b9c]">
            Format: UTF-8 Text (.txt) — Mobile &amp; PC compatible
          </p>
        )}
      </div>
    </section>
  );
}
