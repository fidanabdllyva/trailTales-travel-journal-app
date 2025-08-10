export const setAccessToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");

  window.location.href = "/"; // redirect to login page
};
