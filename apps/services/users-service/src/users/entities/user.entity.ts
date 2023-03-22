interface StringMultiValuedValue {
  display?: string;
  primary?: boolean;
  type?: string;
  value?: string;
}

interface Address {
  country?: string;
  display?: string;
  formatted?: string;
  locality?: string;
  postalCode?: string;
  primary?: boolean;
  region?: string;
  streetAddress?: string;
  type?: string;
}

interface Meta {
  created: number;
  lastModified: number;
  resourceType: string;
  timeZoneId?: string;
}

interface Name {
  familyName?: string;
  formatted?: string;
  givenName?: string;
  honorificPrefix?: string;
  honorificSuffix?: string;
  middleName?: string;
}

export class User {
  public id: string;
  public active: boolean;
  public addresses?: Address[];
  public displayName?: string;
  public emails?: StringMultiValuedValue;
  public entitlements?: StringMultiValuedValue;
  public externalId?: string;
  public groups?: StringMultiValuedValue;
  public ims?: StringMultiValuedValue;
  public locale?: string;
  public meta?: Meta;
  public name?: Name;
  public nickName?: string;
  public phoneNumbers?: StringMultiValuedValue;
  public photos?: StringMultiValuedValue;
  public preferredLanguage?: string;
  public profileUrl?: string;
  public roles?: StringMultiValuedValue;
  public timeZone?: string;
  public title?: string;
  public userName: string;
  public userType?: string;
  public website?: string;

  public static get modelName(): string {
    return 'User';
  }
}
