import React, { createContext, useState } from 'react';

export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const [empresaActiva, setEmpresaActiva] = useState('Transportes DTLL');

  return (
    <TenantContext.Provider value={{ empresaActiva, setEmpresaActiva }}>
      {children}
    </TenantContext.Provider>
  );
};
