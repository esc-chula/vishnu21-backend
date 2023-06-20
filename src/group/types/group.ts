import { ContactPayload } from '@prisma/client';

interface TGroup {
  groupId: string;
  houseName: string;
  group: string;
  description?: string;
  score?: number;
  contacts?: ContactPayload[];
}

export type { TGroup };
