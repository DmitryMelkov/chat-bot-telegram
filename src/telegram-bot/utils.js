const AUTHORIZED_USERS = new Map(
  (process.env.AUTHORIZED_USERS || '')
    .split(',')
    .map(entry => entry.split(':'))
    .map(([id, surname]) => [parseInt(id), { surname }])
);

export const checkAuthorization = (userId) => {
  return AUTHORIZED_USERS.has(userId);
};

export const getUserSurname = (userId) => {
  const user = AUTHORIZED_USERS.get(userId);
  return user ? user.surname : 'Неизвестный';
};