"use client";
import { SignOut } from "@phosphor-icons/react";
import Link from "next/link";
import Menu from "../menu/Menu";
import { AuthServices } from "@/core/services/AuthServices";

export default function Header() {
  const authServices = AuthServices();

  const handleSignOut = () => {
    authServices.logout();
  };

  return (
    <header className="w-full h-14 py-2 shadow-sm">
      <div className="px-3 w-full h-full max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/home">
          <div className="flex items-center gap-2 text-gray-600 hover:text-blue-500 cursor-pointer transition-colors duration-300">
            <img
              src="https://imc.unifei.edu.br/wp-content/uploads/2021/07/cropped-pequeno_logo.png"
              alt="Logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-semibold ml-4 text-white">IMC</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Menu />
          <div
            className="text-[#020817] hover:text-red-500 cursor-pointer transition-colors duration-300"
            onClick={handleSignOut}
            title="Sign out"
          >
            <SignOut size={20} weight="regular" />
          </div>
        </div>
      </div>
    </header>
  );
}
