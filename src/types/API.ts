export type APICommandRegistrationResponse = {
  id: string;
  application_id: string;
  version: string;
  default_permission: boolean;
  default_member_permissions: unknown;
  type: number;
  nsfw: boolean;
  name: string;
  description: string;
  dm_permission: boolean;
};
