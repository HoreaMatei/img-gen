import { twMerge } from "tailwind-merge";

const Form = ({ children, className, action }) => {
  return (
    <form
      action={action}
      className={twMerge(
        " bg-[#ffffff21] backdrop-blur-md shadow-lg p-4 flex flex-col gap-3 lg:w-96 sm:w-80 ",
        className
      )}
    >
      {children}
    </form>
  );
};

export default Form;
