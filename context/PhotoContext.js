import { createContext, useContext, useState } from 'react';

const PhotoContext = createContext(null);

export function PhotoProvider({ children }) {
  const [photos, setPhotos] = useState([]);
  const [info, setInfo] = useState({ name: '', periodo: '', prezzo: '' });

  return (
    <PhotoContext.Provider value={{ photos, setPhotos, info, setInfo }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhoto() {
  return useContext(PhotoContext);
}
