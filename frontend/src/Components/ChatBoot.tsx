"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function ChatBoot() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div
        className={`fixed bottom-5 right-6 z-50 bg-[#5046a5] p-4 ${
          isChatOpen ? "rounded-xl" : "rounded-full"
        }`}
      >
        <div className="chatbot-container">
          <div
            className="chatbot-header cursor-pointer flex items-center justify-between text-white"
            onClick={toggleChat}
          >
            <div className="flex items-center gap-2">
              <Image
                src="/operator.png"
                alt="Operator Icon"
                width={100}
                height={100}
                className="w-8 h-8 rounded-full"
              />
              <span
                className={`font-semibold ${isChatOpen ? "block" : "hidden"} `}
              >
                Hai, Ada yang bisa bantu?
              </span>
            </div>
            <span
              className={`ml-2 transform transition-transform ${
                isChatOpen ? "rotate-180" : "hidden"
              }`}
            >
              ^
            </span>
          </div>
          {isChatOpen && (
            <div className="chatbot-body bg-white border mt-2 p-4 rounded-md shadow-md">
              <div className="chat-messages h-60 overflow-y-auto">
                <p className="text-gray-500">
                  Belum ada pesan. Mulai percakapan!
                </p>
              </div>

              <form>
                <div className="chat-input mt-2">
                  <input
                    type="text"
                    placeholder="Ketik pesan..."
                    className="w-full p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 border-2 border-gray-300 "
                  />
                  <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
