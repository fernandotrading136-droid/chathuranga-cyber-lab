export interface QuizQuestion {
  id: number;
  topic: string;
  questionSi: string;
  questionHintEn: string;
  options: {
    id: string;
    labelSi: string;
  }[];
  correctOptionId: string;
  explanationSi: string;
  explanationEn: string;
}

export type WordCategory = 'All' | 'Attacks' | 'Defense' | 'Network';

export interface CyberWord {
  id: string;
  term: string;
  pronunciationSi: string;
  category: Exclude<WordCategory, 'All'>;
  categorySi: string;
  shortMeaningSi: string;
  explanationSi: string;
  exampleSi: string;
  safetyStepsSi: string[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'Phishing (වංචාකාරී පණිවිඩ)',
    questionSi:
      'ඔබගේ බැංකු ගිණුම අවහිර වී ඇති බව පවසමින් Password හෝ OTP ඉල්ලා එවන ව්‍යාජ Email හෝ SMS පණිවිඩ හඳුන්වන්නේ කුමන නමින්ද?',
    questionHintEn: 'Fake messages asking for passwords or bank OTP details.',
    options: [
      { id: 'a', labelSi: 'Firewall (ෆයර්වෝල්)' },
      { id: 'b', labelSi: 'Phishing (ෆිෂින්)' },
      { id: 'c', labelSi: 'Encryption (එන්ක්‍රිප්ෂන්)' },
      { id: 'd', labelSi: 'Backup (බැකප්)' },
    ],
    correctOptionId: 'b',
    explanationSi:
      'නිවැරදියි! Phishing යනු විශ්වාසදායක ආයතනයක් ලෙස පෙනී සිටිමින් ඔබගේ Password, OTP හෝ බැංකු තොරතුරු සොරා ගැනීමට කරන වංචාවකි.',
    explanationEn:
      'Phishing tricks users into revealing sensitive info like passwords or OTPs through fake links or messages.',
  },
  {
    id: 2,
    topic: 'Password Security (මුරපද ආරක්ෂාව)',
    questionSi:
      'පහත සඳහන් ඒවායින් වඩාත්ම ආරක්ෂිත සහ ශක්තිමත් මුරපදය (Strong Password) කුමක්ද?',
    questionHintEn: 'Which password is hardest for hackers to crack?',
    options: [
      { id: 'a', labelSi: '12345678' },
      { id: 'b', labelSi: 'password2026' },
      { id: 'c', labelSi: 'K#9mP!4vL@8xQ' },
      { id: 'd', labelSi: 'chathuranga123' },
    ],
    correctOptionId: 'c',
    explanationSi:
      'ශක්තිමත් Password එකක අවම වශයෙන් අකුරු 12ක්වත් තිබිය යුතු අතර කැපිටල්/සිම්පල් අකුරු, ඉලක්කම් සහ සංකේත (#, !, @) මිශ්‍ර විය යුතුය.',
    explanationEn:
      'A strong password mixes uppercase, lowercase, numbers, and special symbols with at least 12 characters.',
  },
  {
    id: 3,
    topic: 'Account Protection (ගිණුම් ආරක්ෂාව)',
    questionSi:
      'Password එකට අමතරව ඔබගේ දුරකථනයට එන OTP කේතයක් මගින් ගිණුම ආරක්ෂා කරන ක්‍රමය හඳුන්වන්නේ කෙසේද?',
    questionHintEn: 'Adding a second verification step like an OTP or app code.',
    options: [
      { id: 'a', labelSi: 'Two-Factor Authentication (2FA)' },
      { id: 'b', labelSi: 'Malware Scan' },
      { id: 'c', labelSi: 'Wi-Fi Hotspot' },
      { id: 'd', labelSi: 'Cookies' },
    ],
    correctOptionId: 'a',
    explanationSi:
      '2FA (Two-Factor Authentication) මගින් යමෙකු ඔබගේ Password එක සොරා ගත්තත්, දෙවන ආරක්ෂක කේතය නොමැතිව ගිණුමට ඇතුළු වීම වළක්වයි.',
    explanationEn:
      '2FA adds a second lock (OTP or authenticator code) so a stolen password alone is not enough to break in.',
  },
  {
    id: 4,
    topic: 'Web Safety (වෙබ් ආරක්ෂාව)',
    questionSi:
      'වෙබ් අඩවියක් සමඟ ඔබ හුවමාරු කරන දත්ත ආරක්ෂිතව (Encrypted) ගමන් කරන බව තහවුරු කරන ලිපිනයේ ආරම්භය කුමක්ද?',
    questionHintEn: 'Look at the prefix in the browser address bar for safe sites.',
    options: [
      { id: 'a', labelSi: 'http://' },
      { id: 'b', labelSi: 'ftp://' },
      { id: 'c', labelSi: 'https://' },
      { id: 'd', labelSi: 'www.' },
    ],
    correctOptionId: 'c',
    explanationSi:
      'HTTPS හි "S" අකුරෙන් Secure යන්න අදහස් වේ. එය ඔබ සහ වෙබ් අඩවිය අතර දත්ත Encrypt කර ආරක්ෂා කරයි.',
    explanationEn:
      'HTTPS encrypts data between your browser and the website, protecting logins and card numbers from eavesdroppers.',
  },
  {
    id: 5,
    topic: 'Malware & Ransomware (අනිෂ්ට මෘදුකාංග)',
    questionSi:
      'පරිගණකයේ ඇති සියලුම Files Lock (Encrypt) කර, ඒවා නැවත ලබා දීමට මුදල් (කප්පම්) ඉල්ලන වෛරස් වර්ගය කුමක්ද?',
    questionHintEn: 'Malicious software that locks your files and demands payment.',
    options: [
      { id: 'a', labelSi: 'Antivirus' },
      { id: 'b', labelSi: 'Ransomware' },
      { id: 'c', labelSi: 'VPN' },
      { id: 'd', labelSi: 'Browser Cache' },
    ],
    correctOptionId: 'b',
    explanationSi:
      'Ransomware යනු ඔබේ Files අගුළු දමා මුදල් ඉල්ලන භයානක Malware වර්ගයකි. නිතර Backup තබා ගැනීමෙන් මෙයින් ආරක්ෂා විය හැක.',
    explanationEn:
      'Ransomware encrypts your files and demands ransom. Regular offline backups are the best defense.',
  },
];

export const CYBER_WORDS: CyberWord[] = [
  {
    id: 'phishing',
    term: 'Phishing',
    pronunciationSi: 'ෆිෂින්',
    category: 'Attacks',
    categorySi: 'ප්‍රහාර',
    shortMeaningSi: 'ව්‍යාජ පණිවිඩ මගින් තොරතුරු සොරා ගැනීම',
    explanationSi:
      'බැංකුවක්, Facebook හෝ විශ්වාසවන්ත ආයතනයක් ලෙස පෙනී සිටිමින් ව්‍යාජ Link එකක් එවා ඔබේ Password, OTP හෝ කාඩ් අංක ලබා ගැනීමට කරන උපක්‍රමයකි.',
    exampleSi:
      'උදාහරණය: "ඔබට රු. 50,000ක් දිනුම් ඇදී ඇත, මෙම Link එක Click කරන්න" යැයි එන ව්‍යාජ WhatsApp/SMS පණිවිඩ.',
    safetyStepsSi: [
      'කිසිම විටෙක ඔබගේ Bank OTP, PIN හෝ Password කිසිවෙකුට ලබා නොදෙන්න.',
      'නොදන්නා SMS, WhatsApp හෝ Email වල එන Links කිසිවිටෙක Click නොකරන්න.',
      'බැංකු ගිණුම ගැන සැකයක් ඇත්නම් වහාම බැංකුවේ නිල දුරකථන අංකයට Call කර විමසන්න.',
      'වෙබ් අඩවියේ Address Bar එකේ නිවැරදි Domain නාමය සහ https:// ඇත්දැයි පරීක්ෂා කරන්න.',
      'වැරදීමකින් Link එක Click කළහොත් වහාම බැංකු Password සහ Card Lock කරන්න.',
    ],
  },
  {
    id: 'malware',
    term: 'Malware',
    pronunciationSi: 'මැල්වෙයාර්',
    category: 'Attacks',
    categorySi: 'ප්‍රහාර',
    shortMeaningSi: 'හානිකර මෘදුකාංග (Virus, Trojan ආදිය)',
    explanationSi:
      'Malicious Software යන්න කෙටි කර Malware ලෙස හඳුන්වයි. ඔබේ දුරකථනයට හෝ පරිගණකයට හානි කිරීමට හෝ දත්ත සොරා ගැනීමට නිර්මාණය කළ වැඩසටහන් මේ නමින් හැඳින්වේ.',
    exampleSi:
      'උදාහරණය: නොදන්නා වෙබ් අඩවි වලින් Download කරන Cracked Apps හෝ Fake Games තුළ සැඟවී ඇති Virus.',
    safetyStepsSi: [
      'Google Play Store, Apple App Store හෝ නිල වෙබ් අඩවි වලින් පමණක් Apps Download කරන්න.',
      'නොමිලේ ලැබෙන Cracked Software, Mod APK හෝ Fake Games Install කිරීමෙන් වළකින්න.',
      'විශ්වාසදායක Antivirus මෘදුකාංගයක් Install කර නිතර Full Scan කරන්න.',
      'නොදන්නා USB Pen Drives පරිගණකයට සම්බන්ධ කිරීමට පෙර Virus Scan කරන්න.',
    ],
  },
  {
    id: 'firewall',
    term: 'Firewall',
    pronunciationSi: 'ෆයර්වෝල්',
    category: 'Defense',
    categorySi: 'ආරක්ෂාව',
    shortMeaningSi: 'අනවසර ඇතුළුවීම් වළක්වන ආරක්ෂක පවුර',
    explanationSi:
      'ඔබගේ පරිගණකයට හෝ ජාලයට පැමිණෙන සහ පිටවන දත්ත පරීක්ෂා කර, අනාරක්ෂිත හෝ අනවසර සම්බන්ධතා අවහිර කරන ආරක්ෂක පද්ධතියකි.',
    exampleSi:
      'උදාහරණය: නිවසක ගේට්ටුවේ සිටින ආරක්ෂක නිලධාරියෙක් හොඳ අයට පමණක් ඇතුළු වීමට ඉඩ දී සැක සහිත අය නවත්වනවා වැනිය.',
    safetyStepsSi: [
      'Windows Defender Firewall හෝ Mac Firewall සැමවිටම ON (Active) තබාගන්න.',
      'ඔබගේ නිවසේ Wi-Fi Router එකේ Built-in Firewall පහසුකම සක්‍රීය කරන්න.',
      'භාවිතා නොකරන Network Ports සහ Remote Access සේවා වසා දමන්න.',
      'නොදන්නා App එකක් අන්තර්ජාල අවසර (Firewall Access) ඉල්ලූ විට Allow කිරීමට පෙර සිතන්න.',
    ],
  },
  {
    id: '2fa',
    term: '2FA (Two-Factor Auth)',
    pronunciationSi: 'ද්වි-සාධක සත්‍යාපනය',
    category: 'Defense',
    categorySi: 'ආරක්ෂාව',
    shortMeaningSi: 'ගිණුමට අමතර දෙවන අගුලක් දැමීම',
    explanationSi:
      'Password එක ඇතුළත් කළ පසු, ඔබේ දුරකථනයට එන SMS OTP කේතය හෝ Authenticator App කේතය ලබා දීමෙන් පමණක් ගිණුමට ඇතුළු විය හැකි ක්‍රමයයි.',
    exampleSi:
      'උදාහරණය: Gmail හෝ Facebook Log වීමේදී Password එකට අමතරව Phone එකට එන ඉලක්කම් 6ක කේතය ඉල්ලීම.',
    safetyStepsSi: [
      'Gmail, Facebook, WhatsApp සහ බැංකු Apps සියල්ලටම වහාම 2FA සක්‍රීය කරන්න.',
      'SMS OTP වලට වඩා ආරක්ෂිත Google Authenticator හෝ Authy App භාවිතා කරන්න.',
      'ඔබගේ 2FA Backup Codes ආරක්ෂිත ස්ථානයක ලියා තබාගන්න.',
      'ඔබ Log නොවූ වේලාවක 2FA Alert එකක් ආවොත් වහාම Password වෙනස් කරන්න.',
    ],
  },
  {
    id: 'encryption',
    term: 'Encryption',
    pronunciationSi: 'එන්ක්‍රිප්ෂන්',
    category: 'Defense',
    categorySi: 'ආරක්ෂාව',
    shortMeaningSi: 'දත්ත රහස් කේත බවට පත් කර ආරක්ෂා කිරීම',
    explanationSi:
      'සාමාන්‍යයෙන් කියවිය හැකි පණිවිඩයක් හෝ ගොනුවක්, අවසර ඇති අයට පමණක් කියවිය හැකි රහස් සංකේත බවට හැරවීමයි.',
    exampleSi:
      'උදාහරණය: WhatsApp හි "End-to-End Encrypted" පණිවිඩ යවන්නාට සහ ලබන්නාට පමණක් කියවිය හැකි වීම.',
    safetyStepsSi: [
      'පෞද්ගලික පණිවිඩ යැවීම සඳහා End-to-End Encryption ඇති WhatsApp හෝ Signal භාවිතා කරන්න.',
      'ඔබගේ දුරකථනයට සහ ලැප්ටොප් එකට Strong Screen Lock / Device Encryption දමන්න.',
      'වැදගත් Documents සහ Backup Files Password එකකින් Encrypt කර සුරකින්න.',
      'Passwords හෝ Bank විස්තර කිසිවිටෙක සාමාන්‍ය Text File එකක Save නොකරන්න.',
    ],
  },
  {
    id: 'vpn',
    term: 'VPN (Virtual Private Network)',
    pronunciationSi: 'වී.පී.එන්',
    category: 'Network',
    categorySi: 'ජාල ආරක්ෂාව',
    shortMeaningSi: 'අන්තර්ජාල සම්බන්ධතාවය ආරක්ෂිත උමගකින් යැවීම',
    explanationSi:
      'ඔබගේ IP ලිපිනය සඟවා, අන්තර්ජාලය හරහා යන දත්ත Encrypt කර ආරක්ෂිතව සම්බන්ධ වීමට උපකාරී වන තාක්ෂණයකි.',
    exampleSi:
      'උදාහරණය: Cafe එකක හෝ ගුවන්තොටුපළක ඇති Public Free Wi-Fi භාවිතා කරන විට හැකර්වරුන්ගෙන් ආරක්ෂා වීමට VPN භාවිතා කිරීම.',
    safetyStepsSi: [
      'හෝටල්, Cafe හෝ Airport වල Free Public Wi-Fi භාවිතයේදී අනිවාර්යයෙන් VPN ON කරන්න.',
      'නොදන්නා නොමිලේ දෙන VPN Apps වෙනුවට විශ්වාසවන්ත No-Logs VPN සේවාවක් තෝරන්න.',
      'Public Wi-Fi මත VPN නොමැතිව Online Banking හෝ Shopping නොකරන්න.',
      'භාවිතා නොකරන විට Phone එකේ Auto-Connect to Open Wi-Fi සැකසුම OFF කරන්න.',
    ],
  },
  {
    id: 'ransomware',
    term: 'Ransomware',
    pronunciationSi: 'රැන්සම්වෙයාර්',
    category: 'Attacks',
    categorySi: 'ප්‍රහාර',
    shortMeaningSi: 'Files අගුළු දමා කප්පම් මුදල් ඉල්ලීම',
    explanationSi:
      'පරිගණකයට ඇතුළු වී ඔබගේ Photos, Documents සියල්ල Encrypt (Lock) කර, ඒවා විවෘත කිරීමට මුදල් ඉල්ලා සිටින භයානක Malware වර්ගයකි.',
    exampleSi:
      'උදාහරණය: කාර්යාලයක සියලුම පරිගණක Lock වී "Bitcoin ගෙවන්න" යැයි තිරයේ දිස්වීම.',
    safetyStepsSi: [
      'වැදගත් Photos සහ Files වල Offline Backup එකක් External Hard Drive එකක තබාගන්න.',
      'නොදන්නා Email Attachments (.zip, .exe, .docm) කිසිවිටෙක Open නොකරන්න.',
      'පරිගණකයට Ransomware ආසාදනය වුවහොත් වහාම Wi-Fi / Internet Cable විසන්ධි කරන්න.',
      'හැකර්වරුන්ට කිසිවිටෙක කප්පම් මුදල් (Ransom) නොගෙවන්න; Data Recovery උපදෙස් ලබාගන්න.',
    ],
  },
  {
    id: 'social-engineering',
    term: 'Social Engineering',
    pronunciationSi: 'සෝෂල් ඉංජිනියරින්',
    category: 'Attacks',
    categorySi: 'ප්‍රහාර',
    shortMeaningSi: 'මිනිසුන් රවටා රහස් තොරතුරු ලබා ගැනීම',
    explanationSi:
      'පරිගණක පද්ධති Hack කරනවා වෙනුවට, මිනිසුන්ගේ විශ්වාසය, බිය හෝ කුතුහලය භාවිතා කර ඔවුන් ලවාම රහස් තොරතුරු ලබා ගැනීමයි.',
    exampleSi:
      'උදාහරණය: දුරකථන ඇමතුමක් දී "මම බැංකුවේ IT අංශයෙන් කතා කරන්නේ, ඔබේ OTP එක කියන්න" යැයි රැවටීම.',
    safetyStepsSi: [
      '"ඔබේ ගිණුම දැන්ම Block වෙනවා" යැයි බිය ගන්වා කලබල කරන ඇමතුම් වලට රැවටෙන්න එපා.',
      'බැංකු හෝ රාජ්‍ය ආයතන කිසිවිටෙක දුරකථනයෙන් Password, PIN හෝ OTP අසන්නේ නැත.',
      'මිතුරෙකු හදිසි මුදල් ඉල්ලා Message කළහොත් Voice Call එකක් ගෙන තහවුරු කරගන්න.',
      'සැකසහිත ඇමතුමක් ආවොත් වහාම Cut කර නිල ආයතන අංකයට කතා කරන්න.',
    ],
  },
  {
    id: 'https',
    term: 'HTTPS',
    pronunciationSi: 'එච්.ටී.ටී.පී.එස්',
    category: 'Network',
    categorySi: 'ජාල ආරක්ෂාව',
    shortMeaningSi: 'ආරක්ෂිත වෙබ් අඩවි සම්බන්ධතාවය',
    explanationSi:
      'Hypertext Transfer Protocol Secure යන්නයි. වෙබ් බ්‍රව්සරය සහ වෙබ් අඩවිය අතර හුවමාරු වන තොරතුරු රහස්‍ය ලෙස Encrypt කරයි.',
    exampleSi:
      'උදාහරණය: බැංකු වෙබ් අඩවියකට ඇතුළු වන විට Address Bar එකේ Padlock (අගුළු) ලකුණ සහ https:// දැකීම.',
    safetyStepsSi: [
      'Password හෝ Card අංක ඇතුළත් කිරීමට පෙර https:// සහ Padlock ලකුණ ඇත්දැයි බලන්න.',
      '"Not Secure" (http://) ලෙස පෙන්වන වෙබ් අඩවි වල කිසිවිටෙක Log වීමට උත්සාහ නොකරන්න.',
      'වෙබ් අඩවියේ අකුරු වෙනස් කර සෑදූ ව්‍යාජ Links (උදා: faceb00k.com) ගැන සැලකිලිමත් වන්න.',
      'Browser එකේ "Always Use HTTPS" ආරක්ෂක සැකසුම සක්‍රීය කර තබාගන්න.',
    ],
  },
  {
    id: 'brute-force',
    term: 'Brute Force Attack',
    pronunciationSi: 'බෲට් ෆෝස් ප්‍රහාරය',
    category: 'Attacks',
    categorySi: 'ප්‍රහාර',
    shortMeaningSi: 'සියලුම Password සංයෝජන අත්හදා බැලීම',
    explanationSi:
      'ස්වයංක්‍රීය මෘදුකාංගයක් භාවිතා කර තත්පරයකට Password දහස් ගණනක් අනුමාන කරමින් ගිණුමකට ඇතුළු වීමට උත්සාහ කිරීමයි.',
    exampleSi:
      'උදාහරණය: "123456" වැනි සරල Password එකක් තත්පර කිහිපයකින් Brute Force මගින් සොයා ගැනීම.',
    safetyStepsSi: [
      'අවම වශයෙන් අකුරු 12කට වැඩි (Capital, Simple, ඉලක්කම්, @#$%) Strong Password භාවිතා කරන්න.',
      'උපන් දිනය, දුරකථන අංකය හෝ "123456" වැනි පහසුවෙන් අනුමාන කළ හැකි Passwords නොදමන්න.',
      'සෑම ගිණුමකටම වෙනස් Password එකක් භාවිතා කර Password Manager එකක සුරකින්න.',
      '2FA සක්‍රීය කිරීමෙන් Password එක අනුමාන කළත් හැකර්ට ඇතුළු වීමට නොහැකි වේ.',
    ],
  },
  {
    id: 'ddos',
    term: 'DDoS Attack',
    pronunciationSi: 'ඩී.ඩොස් ප්‍රහාරය',
    category: 'Network',
    categorySi: 'ජාල ආරක්ෂාව',
    shortMeaningSi: 'වෙබ් අඩවියකට අධික Traffic එවා අඩපණ කිරීම',
    explanationSi:
      'Distributed Denial of Service යනු එකවර පරිගණක දහස් ගණනකින් ව්‍යාජ ඉල්ලීම් යවා Server එකක් Slow කිරීම හෝ Crash කිරීමයි.',
    exampleSi:
      'උදාහරණය: කුඩා කඩයකට එකවර මිනිසුන් 10,000ක් ඇතුළු වී සැබෑ පාරිභෝගිකයන්ට ඇතුළු වීමට නොහැකි වීම වැනිය.',
    safetyStepsSi: [
      'වෙබ් අඩවි සඳහා Cloudflare වැනි DDoS Protection සහ Rate Limiting සේවා භාවිතා කරන්න.',
      'ඔබේ Router සහ Smart උපාංග වල Default Passwords වෙනස් කර Botnet වලට හසුවීම වළක්වන්න.',
      'අධික Traffic එකක් පැමිණෙන විට Server Firewall මගින් සැකසහිත IP ලිපින Block කරන්න.',
      'හදිසියේ වෙබ් අඩවිය Slow වුවහොත් Traffic Logs පරීක්ෂා කර Hosting සහාය ලබාගන්න.',
    ],
  },
  {
    id: 'patch-update',
    term: 'Security Patch / Update',
    pronunciationSi: 'ආරක්ෂක යාවත්කාලීන',
    category: 'Defense',
    categorySi: 'ආරක්ෂාව',
    shortMeaningSi: 'මෘදුකාංගවල ඇති දෝෂ නිවැරදි කිරීම',
    explanationSi:
      'හැකර්වරුන්ට ඇතුළු විය හැකි මෘදුකාංග දුර්වලතා (Vulnerabilities) වසා දැමීමට සමාගම් විසින් නිකුත් කරන Updates වේ.',
    exampleSi:
      'උදාහරණය: Android, iOS හෝ Windows Update ලැබුණු විගස Install කිරීමෙන් නව Virus වලින් ආරක්ෂා වීම.',
    safetyStepsSi: [
      'Android, iOS සහ Windows Security Updates ලැබුණු විගස ප්‍රමාද නොකර Install කරන්න.',
      'Chrome, Edge වැනි Web Browsers සහ WhatsApp වැනි Apps Automatic Update වීමට සකසන්න.',
      'වැරදි වෙබ් අඩවි වලින් එන Fake "Update Your Browser" Popups කිසිවිටෙක Click නොකරන්න.',
      'පැරණි, Update නොලැබෙන මෘදුකාංග ඉවත් කර නව ආරක්ෂිත විකල්ප භාවිතා කරන්න.',
    ],
  },
];

export function buildSession1NotesText(): string {
  return [
    '============================================================',
    'CHATHURANGA CYBER LAB - SESSION 1 STUDY NOTES',
    'Learn Cyber Security in Sinhala & English (Beginner Level 0)',
    '============================================================',
    '',
    '1. CYBER SECURITY YANU KUMADDA? (What is Cyber Security?)',
    '   - ඔබගේ පරිගණක, දුරකථන, ගිණුම් සහ දත්ත අනවසර ප්‍රහාරවලින් ආරක්ෂා කර ගැනීම Cyber Security ලෙස හැඳින්වේ.',
    '   - Protecting computers, phones, networks, and personal data from digital attacks.',
    '',
    '2. BASIC GOLDEN RULES FOR BEGINNERS (මූලික ආරක්ෂක නීති 5)',
    '   [01] Strong Passwords: අවම වශයෙන් අකුරු 12+ (A-Z, a-z, 0-9, !@#$) භාවිතා කරන්න.',
    '        Never reuse the same password across email, banking, and social media.',
    '   [02] Enable 2FA (Two-Factor Authentication): සෑම වැදගත් ගිණුමකටම 2FA සක්‍රීය කරන්න.',
    '   [03] Think Before Clicking (Phishing Check): නොදන්නා SMS/WhatsApp/Email Links Click කරන්න එපා.',
    '        OTP කේත කිසිවෙකුටත් ලබා නොදෙන්න (බැංකුවෙන් කිසිවිටෙක OTP අසන්නේ නැත).',
    '   [04] Check HTTPS: Passwords හෝ Card විස්තර දැමීමට පෙර https:// සහ Padlock ලකුණ පරීක්ෂා කරන්න.',
    '   [05] Keep Backups & Updates: වැදගත් Files වල Backup තබාගන්න. Phone/OS Updates නිතර දමන්න.',
    '',
    '3. COMMON ATTACKS TO RECOGNIZE',
    '   - Phishing: ව්‍යාජ පණිවිඩ මගින් රැවටීම.',
    '   - Malware / Ransomware: හානිකර මෘදුකාංග සහ Files Lock කරන වෛරස්.',
    '   - Social Engineering: මිනිසුන්ගේ විශ්වාසය/බිය භාවිතා කර තොරතුරු ගැනීම.',
    '   - Brute Force: සරල Password අනුමාන කර කැඩීම.',
    '',
    '4. NEXT STEP IN CHATHURANGA CYBER LAB',
    '   - Complete all 5 Quiz Questions in Session 1.',
    '   - Review the Cyber Words Dictionary to master every term.',
    '============================================================',
  ].join('\n');
}

export function buildCyberWordsText(): string {
  const header = [
    '============================================================',
    'CHATHURANGA CYBER LAB - CYBER WORDS DICTIONARY',
    'Bilingual Beginner Glossary (English + Sinhala)',
    '============================================================',
    '',
  ];

  const entries = CYBER_WORDS.flatMap((w, index) => [
    `${String(index + 1).padStart(2, '0')}. ${w.term} (${w.pronunciationSi}) [${w.category} / ${w.categorySi}]`,
    `    Meaning: ${w.shortMeaningSi}`,
    `    Explanation: ${w.explanationSi}`,
    `    ${w.exampleSi}`,
    '',
  ]);

  return [...header, ...entries].join('\n');
}
