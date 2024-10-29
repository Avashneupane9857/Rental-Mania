export const Login = (email, password) => {
  if (email && password) {
    return {
      message: "I received email and password",
      email,
      password,
    };
  }
};
