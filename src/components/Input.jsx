import { twMerge } from "tailwind-merge";

const Input = ({ isTextArea, className, ...props }) => {
  const Component = isTextArea ? "textarea" : "input";

  return (
    <Component
      style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      className={twMerge(
        " bg-white p-2 shadow-lg focus:outline-none  ",
        className
      )}
      {...props}
    />
  );
};

export default Input;
