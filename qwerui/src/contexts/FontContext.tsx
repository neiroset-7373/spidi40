import { createContext, useContext, useState, ReactNode } from 'react';

type FontSize = 'Маленький' | 'Средний' | 'Крупный' | 'Очень крупный';

const fontSizeMap: Record<FontSize, string> = {
  'Маленький': '12px',
  'Средний': '14px',
  'Крупный': '17px',
  'Очень крупный': '21px',
};

interface FontContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontSizeValue: string;
}

const FontContext = createContext<FontContextType>({
  fontSize: 'Средний',
  setFontSize: () => {},
  fontSizeValue: '14px',
});

export function FontProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem('spidi_font_size') as FontSize | null;
    return saved || 'Средний';
  });

  const setFontSize = (size: FontSize) => {
    localStorage.setItem('spidi_font_size', size);
    setFontSizeState(size);
  };

  return (
    <FontContext.Provider value={{ fontSize, setFontSize, fontSizeValue: fontSizeMap[fontSize] }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  return useContext(FontContext);
}
