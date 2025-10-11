import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ title, toggleSidebar }) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between bg-slate-900 px-4 shadow-md sm:px-6">
      
      {/* Lado izquierdo: Botón hamburguesa */}
      <div className="flex items-center justify-start w-10">
        {toggleSidebar && (
          <button
            className="p-1.5 text-blue-300 rounded-md transition-colors duration-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 md:hidden"
            onClick={toggleSidebar}
            aria-label="Abrir menú"
          >
            <Menu size={24} /> {/* Icono más pequeño para móvil */}
          </button>
        )}
      </div>

      {/* Centro: Título responsivo y truncado */}
      <div className="flex-1 flex justify-center items-center min-w-0 mx-2">
        <h1 className="font-bold tracking-wider uppercase text-blue-200 truncate text-lg sm:text-xl lg:text-2xl">
          {title}
        </h1>
      </div>

      {/* Lado derecho: Espaciador para mantener el título centrado */}
      <div className="flex items-center justify-end w-10" />

    </header>
  );
}