import { User } from '@types'
import { v4 as uuidv4 } from 'uuid'
import { uniqueNamesGenerator, names, starWars } from 'unique-names-generator'

export const generateUsersList = (): Partial<User>[] =>
  Array.from({ length: 15 }, (_, i) => ({
    id: uuidv4(),
    createdTimestamp: new Date(
      +new Date() - Math.floor(Math.random() * 10000000000)
    ).getTime(),
    username: uniqueNamesGenerator({
      dictionaries: [names],
      style: 'lowerCase',
    }),
    enabled: true,
    totp: false,
    emailVerified: true,
    firstName: uniqueNamesGenerator({
      dictionaries: [names],
    }),
    lastName: uniqueNamesGenerator({
      dictionaries: [names],
    }),
    email:
      uniqueNamesGenerator({
        dictionaries: [names],
        separator: '-',
        style: 'lowerCase',
      }) + '@example.com',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: false,
      view: true,
      mapRoles: false,
      impersonate: false,
      manage: false,
    },
  }))
