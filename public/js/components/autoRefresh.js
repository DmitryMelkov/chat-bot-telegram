export const autoRefreshIframe = () => {
  setInterval(() => {
    location.reload();
  }, 60000);
};
