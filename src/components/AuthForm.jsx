import React, { useState, useActionState } from "react";
import Form from "./Form";
import InputContainer from "./InputContainer";
import Label from "./Label";
import Input from "./Input";
import { useAuthContext } from "../store/auth-context";

const AuthForm = () => {
  const authCtx = useAuthContext();
  const [authMode, setAuthMode] = useState("login");
  const [error, setError] = useState();

  function handleSwitchAuthMode() {
    setAuthMode((prevAuthMode) => {
      if (prevAuthMode === "login") {
        return "signup";
      } else {
        return "login";
      }
    });
  }

  async function submitAction(_, formData) {
    setError();
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      if (authMode === "signup") {
        await authCtx.signup(email, password);
      } else {
        await authCtx.login(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  const [, action, isPending] = useActionState(submitAction);
  return (
    <div className=" text-center  ">
      <h2 className="font-bold text-white text-xl sm:text-2xl lg:text-3xl font-mono mt-10">
        Login to try it
      </h2>
      <Form
        action={action}
        className="max-w-[25rem] bg-[#ffffff10] mt-10 mx-auto"
      >
        <InputContainer>
          <Label htmlFor="email">Email</Label>
          <Input className="h-8 lg:h-10" type="email" id="email" name="email" />
        </InputContainer>

        <InputContainer>
          <Label htmlFor="password">Password</Label>
          <Input
            className="h-8 lg:h-10"
            type="password"
            id="password"
            name="password"
          />
        </InputContainer>
        {error && <p className="text-red-300  0mt-3">{error}</p>}
        <p className="flex flex-col gap-3 mt-4">
          <button
            disabled={isPending}
            className="bg-[#d3d3d3ec] mx-auto  shadow-lg text-black py-2 hover:bg-[#b1aeaeec] disabled:cursor-not-allowed disabled:bg-stone-400 disabled:text-stone-600 w-48 lg:w-80  "
          >
            {!isPending && authMode === "login"
              ? "Login"
              : !isPending
              ? "Sign up"
              : "Submitting"}
          </button>
          <button
            button
            disabled={isPending}
            type="button"
            onClick={handleSwitchAuthMode}
          >
            {authMode === "login"
              ? "Create a new user"
              : "I already have an account, log in instead."}
          </button>
        </p>
      </Form>
    </div>
  );
};

export default AuthForm;
