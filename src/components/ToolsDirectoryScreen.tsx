import {
  KeyRound,
  QrCode,
  Wifi,
  Lock,
  ArrowLeftRight,
  ChevronRight,
} from 'lucide-react';
import { TOOLS_CATALOG, type ToolId } from '../data/toolsCatalog';

interface ToolsDirectoryScreenProps {
  onOpenTool: (toolId: ToolId) => void;
}

const TOOL_ICONS: Record<ToolId, typeof KeyRound> = {
  'password-generator': KeyRound,
  'qr-maker': QrCode,
  'ip-device-info': Wifi,
  'text-encryptor': Lock,
  'unit-converter': ArrowLeftRight,
};

export function ToolsDirectoryScreen({ onOpenTool }: ToolsDirectoryScreenProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-lg sm:text-xl font-bold text-[#e6f7ed]">
          All Toolkit Modules
        </h2>
        <p className="text-xs sm:text-sm text-[#78a88a]">
          Select any utility below to open it in full view
        </p>
      </div>

      <div className="divide-y divide-[#11291b] overflow-hidden rounded-2xl border border-[#143622] bg-[#07100b]">
        {TOOLS_CATALOG.map((tool, index) => {
          const Icon = TOOL_ICONS[tool.id];
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onOpenTool(tool.id)}
              className="flex w-full items-center justify-between gap-3.5 px-4 py-4 text-left transition-colors hover:bg-[#0b1811] active:bg-[#0f2217] cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#00ff66]/35 bg-[#0b1f13] text-[#00ff66]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-[#6ea182]">
                    <span className="font-mono-tech tabular-nums">
                      0{index + 1}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{tool.category}</span>
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-semibold text-[#e6f7ed]">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-[#89b89b] line-clamp-1">
                    {tool.description}
                  </p>
                </div>
              </div>
              <ChevronRight
                className="h-5 w-5 shrink-0 text-[#5d8c70]"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
