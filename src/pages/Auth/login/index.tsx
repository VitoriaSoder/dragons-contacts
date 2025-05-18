import LoginComponent from '../../../components/login/Login';

const Login = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen w-full">
      <div className="relative w-full h-full hidden md:block">
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="/images/login_bg.jpg"
              alt="Login background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-full bg-white p-6 md:p-12">
        <div className="w-full max-w-md">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
};

export default Login;
