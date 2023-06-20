import { ContactPayload } from '@prisma/client';

interface TGroup {
  groupId: string;
  houseName: string;
  group: string;
  description?: string;
  score?: number;
  contacts?: ContactPayload[];
}

interface TEmergency {
  name: string;
  phone: string;
  remark: string;
  role: 'Group' | 'Central';
}

export type { TGroup, TEmergency };
