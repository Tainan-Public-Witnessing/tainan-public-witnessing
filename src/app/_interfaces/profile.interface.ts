export interface Profile {
  uuid: string;
  name: string;

  home: boolean;
  users: boolean;
  congregations: boolean;
  tags: boolean;
  profiles: boolean;
}

export interface ProfilePrimarykey {
  uuid: string;
  name: string;
}
