"use client";
import Link from "next/link";
import ComponentIcon from "@/hook/icon";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function NavbarAdmin() {
  const { MdNotificationsActive } = ComponentIcon.md;
  const { FaSearch, FaUser } = ComponentIcon.fa;

  const [openNotification, setopenNotification] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const pathname = usePathname();

  const pathToTextMap: { [key: string]: string } = {
    "/admin": "Home",
    "/admin/akun": "Akun",
    "/admin/akun/siswa": "Akun Siswa",
    "/admin/akun/siswa/add-siswa": "Add Siswa",
    "/admin/akun/akademik": "Akun Akademik",
    "/admin/akun/akademik/add-akun": "Add Akun Akademik",
    "/admin/chatbot/chat": "Chatbot ",
    "/admin/chatbot/chat/add-chat": "Add Chatbot ",
    "/admin/chatbot/cache": "Cache Chatbot ",
  };

  const currentText = pathToTextMap[pathname as string] || "";

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setopenNotification(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <>
      <header className="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all ease-in duration-250 rounded-2xl lg:flex-nowrap lg:justify-start">
        <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
          <nav>
            <ul className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
              <li className="text-sm font-semibold leading-normal">
                <Link href="" className="text-white opacity-50">
                  Pages
                </Link>
              </li>
              <li className="text-sm font-semibold pl-2 capitalize leading-normal  before:float-left before:pr-2 before:text-white before:content-['/']">
                {currentText}
              </li>
            </ul>
            <h6 className="mb-0 font-bold text-white capitalize">
              {currentText}
            </h6>
          </nav>

          <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
            <div className="flex items-center md:ml-auto md:pr-4">
              <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                <span className="text-sm absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 bg-transparent py-2 px-2.5 text-slate-500">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="pl-9 text-sm font-semibold focus:shadow-primary-outline ease w-1/100 leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-gray-300 dark:bg-slate-850  bg-white py-2 pr-3 text-gray-700 placeholder:text-gray-500  focus:outline-none"
                  placeholder="Type here..."
                />
              </div>
            </div>

            <ul className="flex flex-row justify-center gap-3.5 items-center pl-0 mb-0 list-none md-max:w-full">
              <li className="flex items-center">
                <Link
                  href=""
                  className=" px-0 py-2 text-sm font-semibold text-white transition-all flex justify-center items-center gap-3.5"
                >
                  <FaUser />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </li>

              <li className="relative flex items-center pr-2" ref={dropdownRef}>
                <button
                  onClick={() => setopenNotification(!openNotification)}
                  className="px-0 py-2 font-semibold text-white transition-all text-lg"
                >
                  <MdNotificationsActive />
                </button>

                {openNotification && (
                  <ul className="absolute top-14 right-0 mt-2 w-72 h-full z-50 bg-white dark:bg-slate-850 text-slate-500 rounded-lg shadow-lg">
                    <li className="mb-2">
                      <Link
                        className="block w-full py-2 px-4 transition-colors bg-gray-500 hover:bg-gray-200 dark:hover:bg-slate-900 rounded-lg"
                        href=""
                      >
                        <div className="flex items-center">
                          <Image
                            src="/vercel.svg"
                            width={50}
                            height={50}
                            alt="Notification"
                            className="h-9 w-9 rounded-xl mr-4"
                          />
                          <div>
                            <h6 className="text-sm font-normal dark:text-white">
                              <span className="font-semibold">New message</span>{" "}
                              from Laur
                            </h6>
                            <p className="text-xs text-slate-400 dark:text-white/80">
                              13 minutes ago
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
