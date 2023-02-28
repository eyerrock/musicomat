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

export type W2GAPIResponse = {
  id: number;
  streamkey: string;
  created_at: string;
  persistent: boolean;
  persistent_name: string;
  deleted: boolean;
  moderated: boolean;
  location: string;
  stream_created: boolean;
  background: string;
  moderated_background: boolean;
  moderated_playlist: boolean;
  bg_color: string;
  bg_opacity: number;
  moderated_item: boolean;
  theme_bg: string;
  playlist_id: number;
  members_only: boolean;
  moderated_suggestions: boolean;
  moderated_chat: boolean;
  moderated_user: boolean;
  moderated_cam: boolean;
};
