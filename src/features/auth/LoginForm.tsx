import loginStyle from "./Login.module.css";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import type { LoginReponse, LoginRequest } from "@shared/types/auth";
import { useToast } from "@shared/hooks/useToast";
import { login } from "@shared/services/auth.service";
import { useAuthContext } from "@shared/context/AuthContext";
import { useNavigate } from "react-router";

const SpinnerIcon = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <svg
      width={"20px"}
      height={"20px"}
      fill="hsl(0, 0%, 100%)"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      color="#fff"
    >
      <defs>
        <linearGradient id="radialGradient8932">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      <style>
        {`
        @keyframes spin8932 {
          to {
            transform: rotate(360deg);
          }
        }

        #circle8932 {
          transform-origin: 50% 50%;
          stroke: url(#radialGradient8932);
          fill: none;
          animation: spin8932 0.5s linear infinite;
        }
      `}
      </style>

      <circle
        cx="10"
        cy="10"
        r="8"
        id="circle8932"
        strokeWidth="2"
        color="#fff"
      />
    </svg>
  );
};

const defaultValues: LoginRequest = {
  userName: "",
  password: "",
};

const LoginForm = () => {
  const { register, handleSubmit } = useForm({
    defaultValues,
  });
  const toast = useToast();
  const context = useAuthContext();
  const navigate = useNavigate();

  const handleSuccess = (data: LoginReponse | string | undefined) => {
    // console.log(data);
    if (data && typeof data === "string") {
      toast.warning(data);
    }
    if (data && typeof data === "object") {
      context.onLogin(data.token);
      navigate("/", { replace: true });
    }
  };
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => handleSuccess(data),
    onError: () => toast.warning("Đăng nhập thất bại"),
  });

  const onsubmit: SubmitHandler<LoginRequest> = (data) => {
    // console.log(data);
    mutate(data);
  };

  // Không đặt autoComplete="off" trên form: trình quản lý mật khẩu phải điền
  // được, đó là yêu cầu của WCAG 2.2 (Accessible Authentication).
  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <div className={loginStyle["form-group"]}>
        {/* htmlFor + id: bấm vào nhãn là con trỏ nhảy vào ô, và trình đọc màn
            hình đọc đúng tên trường. Trước đây hai thứ này không nối với nhau. */}
        <label htmlFor="login-username">Tài khoản</label>
        <input
          id="login-username"
          type="text"
          autoComplete="username"
          {...register("userName")}
        />
      </div>

      <div className={loginStyle["form-group"]}>
        <label htmlFor="login-password">Mật khẩu</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
      </div>

      <div className={loginStyle["forgot-password"]}>
        <a href="#">Quên mật khẩu?</a>
      </div>

      <button
        type="submit"
        className={loginStyle["sign-in-btn"]}
        disabled={isPending}
      >
        {isPending && <SpinnerIcon isLoading />}
        Đăng nhập
      </button>
    </form>
  );
};

export default LoginForm;
