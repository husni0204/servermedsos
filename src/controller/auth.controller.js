export const RegisterUser = (req, res) => {
  const { username, email, password, fullname } = req.body;

  res.json({
    status: "success",
    code: 200,
    message: "Register endpoint",
    data: { username, email, password, fullname },
  });
};

export const LoginUser = (req, res) => {
  res.json({
    message: "Login endpoint",
  });
};
