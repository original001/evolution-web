export const userChangeDetailsRequest = (name) => ({
    type: 'userChangeDetailsRequest'
    , data: {name}
    , meta: {server: true}
  });

export const userChangeDetails = (user) => ({
    type: 'userChangeDetails'
    , data: {user}
  });