import AuthService from '../service/AuthService';
const useAuth = () => {
  const user = AuthService.getCurrentUser();
  if (user) {
    return {
      auth: true,
      role: user?.roles[0],
    };
  } else {
    return {
      auth: false,
      role: null,
    };
  }
};

export default useAuth;