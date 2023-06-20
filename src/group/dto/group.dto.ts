interface TGroup {
  groupId: string;
  houseName: string;
  group: string;
  description?: string;
  score?: number;
  contact?: TEmergency[];
}

interface TEmergency {
  name: string;
  phone: string;
  remark: string;
  role: 'Group' | 'Central';
}

export type { TGroup, TEmergency };
