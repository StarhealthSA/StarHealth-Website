'use client';

import logo from '@/assets/doctors/logo1.svg';
import menu from '@/assets/doctors/secondmenu.svg';
import NavLink from '@/components/nav_link';
import { useState } from 'react';
import Menulist from '@/components/menulist/menu_list';
import { useTranslation } from 'react-i18next';
import { HEADER_NAV_LINKS } from '@/constants/nav_routes';

function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 flex w-full justify-between items-center pt-[15px] md:pt-[30px] lg:pt-[8px] pb-[8px] md:pb-[20px] lg:pb-[8px] px-[30px] lg:px-[100px] bg-white shadow-sm">
        {open && (
          <div
            className="fixed inset-0 bg-transparent bg-opacity-50 z-40"
            onClick={() => setOpen(false)}
          />
        )}

        <NavLink href="/">
          <img
            src={logo}
            alt="logo"
            className="w-[102px] h-[32px] cursor-pointer hover:filter hover:brightness-90 hover:saturate(0) hover:invert-[0.3] lg:w-[160px] lg:h-[58px]"
          />
        </NavLink>

        <div className="hidden sm:flex flex-row justify-end items-end">
          <ul className="text-[#002333] flex flex-row sm:text-[14px] md:text-[16px] lg:text-[16px] font-medium">
            {HEADER_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} className="md:pr-[20px] hover:text-[#687276]">
                  {t(link.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="w-[30px] h-[30px] sm:hidden focus:outline-none"
          aria-label="Open menu"
        >
          <img src={menu} alt="menu" className="w-full h-full" />
        </button>
      </div>

      <Menulist open={open} setOpen={setOpen} />
    </>
  );
}

export default Header;
