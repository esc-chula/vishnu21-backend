import { ContactsPayload } from '@prisma/client';

interface TGroup {
  groupId: string;
  houseName: string;
  group: string;
  description?: string;
  score?: number;
  contacts?: ContactsPayload[];
}

export type { TGroup };
