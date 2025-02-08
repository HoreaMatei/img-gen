import { useActionState } from "react";
import Form from "./Form";
import Input from "./Input";
import InputContainer from "./InputContainer";
import Label from "./Label";
import { useAuthContext } from "../store/auth-context";

async function sendImageRequest(prompt, options, authToken) {
  const response = await fetch("http://localhost:3000/generate-image", {
    method: "POST",
    body: JSON.stringify({ prompt, options }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("failed to generate image");
  }

  const imageBlob = await response.blob();
  return URL.createObjectURL(imageBlob);
}

const ImageGeneration = () => {
  const { token, logout } = useAuthContext();

  async function submitAction(_, formData) {
    const prompt = formData.get("prompt");
    const options = {
      quality: formData.get("quality"),
      aspect_ratio: formData.get("aspectRatio"),
      format: formData.get("format"),
    };
    try {
      const imageUrl = await sendImageRequest(prompt, options, token);
      return { result: "success", imageUrl };
    } catch (error) {
      return { result: "error", message: error.message };
    }
  }

  const [formState, action, isPending] = useActionState(submitAction, {
    result: null,
  });
  return (
    <div className=" text-center mt-28">
      <div className="flex  flex-col sm:flex-row items-center gap-10 max-w-[70rem] mx-auto ">
        <Form
          action={action}
          className="flex flex-col w-[25rem] justify-between gap-8"
        >
          <div className="flex flex-col gap-4">
            <InputContainer>
              <Label htmlFor="prompt">Image Prompt</Label>
              <Input type="text" id="prompt" name="prompt" isTextarea />
            </InputContainer>
            <div className="flex gap-5 ">
              <InputContainer>
                <Label htmlFor="quality  ">Quality</Label>
                <Input
                  type="number"
                  id="quality"
                  name="quality"
                  min="1"
                  max="100"
                  step="1.0"
                  defaultValue="80"
                  className="w-[4rem] focus:outline-none "
                />
              </InputContainer>
              <InputContainer>
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <select
                  id="aspectRatio"
                  name="aspectRatio"
                  defaultValue="1:1"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                  className="p-[0.6rem] focus:outline-none rounded-sm w-[6rem]"
                >
                  <option value="1:1">1:1</option>
                  <option value="16:9">16:9</option>
                  <option value="4:3">4:3</option>
                </select>
              </InputContainer>
              <InputContainer>
                <Label htmlFor="format">Format</Label>
                <select
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                  id="format"
                  name="format"
                  defaultValue="png"
                  className="p-[0.6rem] rounded-sm w-[5rem]"
                >
                  <option value="webp">WebP</option>
                  <option value="png">PNG</option>
                  <option value="jpg">JPG</option>
                </select>
              </InputContainer>
            </div>
          </div>
          <p className="flex justify-center">
            <button
              disabled={isPending}
              className="bg-[#d3d3d3ec] text-black py-3 rounded-lg  hover:bg-[#b1aeaeec] disabled:cursor-not-allowed disabled:bg-stone-400 disabled:text-stone-600 px-10 text-lg"
            >
              {isPending ? "Generating..." : "Generate!"}
            </button>
          </p>
        </Form>
        <div className="h-[25rem] flex-1 flex justify-center items-start">
          {!formState.result && (
            <p className="text-stone-400 text-3xl  mt-10 p-8 font-mono">
              Press "Generate" to generate an image based on your prompt.
            </p>
          )}
          {formState.result === "success" && (
            <img
              src={formState.imageUrl}
              alt={formState.prompt}
              className="h-[25rem] shadow-2xl rounded-md"
            />
          )}
          {formState.result === "error" && (
            <p className="text-red-400 text-3xl mt-20">{formState.message}</p>
          )}
        </div>
      </div>

      {token && (
        <button
          onClick={logout}
          className="mt-28 text-stone-300 text-2xl bg-none hover:text-stone-400"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default ImageGeneration;
