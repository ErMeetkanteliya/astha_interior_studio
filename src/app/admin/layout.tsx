import React from 'react';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#FAF9F6] min-h-screen text-deep-black" style={{ backgroundImage: 'none' }}>
      {children}
    </div>
  );
}
