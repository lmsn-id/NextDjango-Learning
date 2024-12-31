"use client";
import { AddChatChatbot } from "@/hook/usePost";

export default function AddChat() {
  const { handleSubmit, register, reset, onSubmit, handleTextareaInput } =
    AddChatChatbot();

  return (
    <>
      <div className="w-full h-full bg-white rounded-2xl shadow-md">
        <div className="p-6 max-h-full overflow-y-auto">
          <div className="w-full flex justify-center mb-4">
            <h1 className="text-gray-900 text-lg font-semibold">Add Chat</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="Value"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Value
              </label>
              <input
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                id="Value"
                type="text"
                placeholder="Masukan Value Chat"
                {...register("Value")}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="TextChat"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Text Chat
              </label>
              <textarea
                id="TextChat"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline resize-none"
                placeholder="Silahkan masukan text chat"
                rows={1}
                {...register("Text")}
                onInput={handleTextareaInput}
              />
            </div>
            <div className="w-full flex justify-end space-x-8">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 rounded-lg shadow-md px-4 py-2 text-white font-semibold"
                onClick={() => reset()}
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-[#3a3086] hover:bg-[#0095da] rounded-lg shadow-md px-4 py-2 text-white font-semibold"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
