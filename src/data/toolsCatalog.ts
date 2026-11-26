export type ToolId =
  | 'password-generator'
  | 'qr-maker'
  | 'ip-device-info'
  | 'text-encryptor'
  | 'unit-converter';

export type NavTab = 'home' | 'tools' | 'network' | 'profile';

export interface ToolMeta {
  id: ToolId;
  name: string;
  shortName: string;
  subtitle: string;
  category: 'Security' | 'Utility' | 'Network';
  description: string;
  accentHex: string;
}

export const APP_LOGO_PATH = '/src/assets/images/cyber_lab_logo_1795586203408.jpg';

export const TOOLS_CATALOG: ToolMeta[] = [
  {
    id: 'password-generator',
    name: 'Password Generator',
    shortName: 'Pass Gen',
    subtitle: 'Crypto Random Keys',
    category: 'Security',
    description:
      'Generate cryptographically secure passwords with custom length, symbols, and live entropy analysis.',
    accentHex: '#00ff66',
  },
  {
    id: 'qr-maker',
    name: 'QR Code Maker',
    shortName: 'QR Maker',
    subtitle: 'Links, Text & Wi-Fi',
    category: 'Utility',
    description:
      'Create scannable QR codes for URLs, plain text, or Wi-Fi networks and download high-res PNGs.',
    accentHex: '#22e58a',
  },
  {
    id: 'ip-device-info',
    name: 'IP & Device Info',
    shortName: 'IP & Device',
    subtitle: 'Network & Hardware',
    category: 'Network',
    description:
      'Inspect your public IP address, browser engine, screen density, CPU cores, and connection status.',
    accentHex: '#00f0b5',
  },
  {
    id: 'text-encryptor',
    name: 'Text Encryptor',
    shortName: 'Encryptor',
    subtitle: 'AES-256 & Ciphers',
    category: 'Security',
    description:
      'Lock sensitive messages using real AES-256-GCM encryption, Base64 encoding, or Caesar cipher.',
    accentHex: '#00ff66',
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    shortName: 'Converter',
    subtitle: 'Data, Speed & Units',
    category: 'Utility',
    description:
      'Convert digital storage (KB to TB), network speeds (Mbps to MB/s), length, weight, and temperature.',
    accentHex: '#34d399',
  },
];
