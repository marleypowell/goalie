import { gql } from '@apollo/client/core';

export const AccountInfoFields = gql`
  fragment AccountInfoFields on Account {
    id
    active
    addresses {
      country
      display
      formatted
      locality
      postalCode
      primary
      region
      streetAddress
      type
    }
    displayName
    emails {
      display
      primary
      type
      value
    }
    entitlements {
      display
      primary
      type
      value
    }
    externalId
    groups {
      display
      primary
      type
      value
    }
    ims {
      display
      primary
      type
      value
    }
    locale
    meta {
      created
      lastModified
      resourceType
      timeZoneId
    }
    name {
      familyName
      formatted
      givenName
      honorificPrefix
      honorificSuffix
      middleName
    }
    nickName
    phoneNumbers {
      display
      primary
      type
      value
    }
    photos {
      display
      primary
      type
      value
    }
    preferredLanguage
    profileUrl
    roles {
      display
      primary
      type
      value
    }
    timeZone
    title
    userName
    userType
    website
  }
`;
