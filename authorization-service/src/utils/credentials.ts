export const parseAllowedCredentials = (rawCredentials?: string): Record<string, string> => {
  if (!rawCredentials) {
    return {};
  }

  return rawCredentials.split(',').reduce((acc, current) => {
    const [username, password] = current.split(':');

    acc[username] = password;

    return acc;
  }, {});
};
