

import { Slot } from 'expo-router';
import React from 'react';
import { PhotoProvider } from '../context/PhotoContext'; // metti path corretto

export default function RootLayout() {
  return (
    <PhotoProvider>
      <Slot />
    </PhotoProvider>
  );
}