import React from 'react';
import MiniAIChatbot from './components/MiniAIChatbot';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <MiniAIChatbot />
    </>
  );
}
