export interface User {
  name: string;
  email: string;
  password: string;
  createdDate: string;
  uuid: string;
}

export interface Transaction {
  id: string;
  date: string;
  action: string;
  flow: string;
  hash: string;
  verification: string;
}

export interface TicketResponse {
  sender: string;
  date: string;
  message: string;
}

export interface Ticket {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: string;
  date: string;
  attachments: string[];
  emailNotifications: boolean;
  responses: TicketResponse[];
}

export interface LeadershipMember {
  name: string;
  role: string;
  icon: string;
  bio: string;
  instagram: string;
  instagram_handle: string;
  twitter: string;
  twitter_handle: string;
  linkedin: string;
  linkedin_handle: string;
  email: string;
}

export const INITIAL_USERS: User[] = [
  {
    name: 'Administrator Demo',
    email: 'user@example.com',
    password: 'password123',
    createdDate: '2026-06-11',
    uuid: 'UID-87F9A01B',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TX-9021A', date: '2026-06-14 11:24:12', action: 'BUY Bitcoin (BTC)', flow: '+0.0245 BTC / -$1,647.39 USD', hash: '0x8fa3f80c...b11a', verification: 'VRD-OK-98' },
  { id: 'TX-8842B', date: '2026-06-13 15:10:45', action: 'BUY Ethereum (ETH)', flow: '+0.8450 ETH / -$2,940.77 USD', hash: '0x4cc9d11b...fa22', verification: 'VRD-OK-44' },
  { id: 'TX-7711C', date: '2026-06-12 09:30:00', action: 'DEPOSIT CASH POOL', flow: '+$20,000.00 USD', hash: '0x119fa99e...a2b2', verification: 'SYSTEM-INIT' },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'VRD-TKT-1082',
    category: 'Transaction issues',
    subject: 'Delayed BTC Swapping Settlement Ledger Checkpoint',
    description: 'Executing a Buy swap on BTC took over 45 seconds to settle in memory. This is causing slippage delays.',
    status: 'UNDER INVESTIGATION',
    date: '2026-06-15 10:14:00',
    attachments: ['screenshot_slippage_error.png'],
    emailNotifications: true,
    responses: [
      { sender: 'System Gatekeeper', date: '2026-06-15 10:15:00', message: 'Automated verification check complete. Case assigned to Tier 2 Security Analyst.' },
    ],
  },
  {
    id: 'VRD-TKT-0941',
    category: 'Account access problems',
    subject: 'MFA Dual-Factor TOTP Sync Clock Drift',
    description: 'The 6-digit verification code was rejected three times despite generating within the valid window.',
    status: 'RESOLVED',
    date: '2026-06-12 16:45:10',
    attachments: ['auth_app_sync.pdf'],
    emailNotifications: false,
    responses: [
      { sender: 'Aria Tanaka', date: '2026-06-12 17:30:00', message: 'Hello! We detected a slight clock drift on Security Server Node 4. We synced the NTP pools and verified TOTP windows are now perfectly aligned. Please let us know if you encounter any other challenges.' },
    ],
  },
];

export const LEADERSHIP_DATA: Record<string, LeadershipMember> = {
  elizabeth: {
    name: 'Elizabeth Harris',
    role: 'CEO & Co-Founder',
    icon: 'User',
    bio: 'Elizabeth leads our overall design vision, product operations, and strategic roadmaps. Under her oversight, Veridion has prioritized light architectures that process enterprise updates instantaneously.',
    instagram: 'https://instagram.com/elizabeth_harris_flow',
    instagram_handle: '@elizabeth_harris_flow',
    twitter: 'https://twitter.com/elizabeth_flow',
    twitter_handle: '@elizabeth_flow',
    linkedin: 'https://linkedin.com/company/veridion-mvp',
    linkedin_handle: 'elizabeth-harris-nexus',
    email: 'elizabeth@veridion.xyz',
  },
  marcus: {
    name: 'Marcus Vance',
    role: 'Lead System Architect',
    icon: 'User',
    bio: 'Marcus commands full system telemetry. He specializes in designing lightweight, distributed REST architectures, optimizing query response rates, and orchestrating native database configurations.',
    instagram: 'https://instagram.com/marcus_architect',
    instagram_handle: '@marcus_architect',
    twitter: 'https://twitter.com/marcus_vance',
    twitter_handle: '@marcus_vance',
    linkedin: 'https://linkedin.com/company/veridion-mvp',
    linkedin_handle: 'marcus-vance-nexus',
    email: 'marcus@veridion.xyz',
  },
  aria: {
    name: 'Aria Tanaka',
    role: 'Head of API Security',
    icon: 'User',
    bio: 'Aria safeguards the transmission integrity of our platform. She focuses on engineering cryptographically secure endpoints, OAuth pipeline structures, and client identity verification logic.',
    instagram: 'https://instagram.com/aria_sec_tanaka',
    instagram_handle: '@aria_sec_tanaka',
    twitter: 'https://twitter.com/aria_tanaka',
    twitter_handle: '@aria_tanaka',
    linkedin: 'https://linkedin.com/company/veridion-mvp',
    linkedin_handle: 'aria-tanaka-nexus',
    email: 'aria@veridion.xyz',
  },
};
