export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  if (user && user.accessToken) {
    return { Authorization: "Bearer " + user.accessToken };
  } else if (token) {
    return { Authorization: "Bearer " + token };
  } else {
    return {};
  }
}
