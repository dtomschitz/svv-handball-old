export interface HvwGymInfo {
  barrierefreiheit: [];
  files: GymInfoFile[];
  geolat: string;
  geolon: string;
  name: string;
  no: string;
  org: string;
  permit_org_1: string;
  permit_org_2: string;
  phone: string;
  street: string;
  town: string;
  wax: string;
}

export interface GymInfoFile {
  cOrg: string;
  changedAt: string;
  comment: string;
  file: string;
  name: string;
  public: true;
  type: string;
  typeNr: number;
  uVerein: any;
  verein: any;
  vereinNr: any;
}
