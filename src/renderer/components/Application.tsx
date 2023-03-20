import React, { useEffect, useState } from 'react';
import './Application.scss';
import Page from './Page/Page';
import FilesSidebar from './FilesSidebar/FilesSidebar';
import MathSidebar from './MathSidebar/MathSidebar';
import Header from './Header/Header';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';
import { GeneralContextProvider } from './GeneralContext';
import { KBarProvider } from 'kbar';
import { CommandBar, actions } from './CommandBar/CommandBar';
import i18n from '@common/i18n';

export const setColor = (name: string, hue: number) => {
  localStorage.setItem('color', name);
  document.documentElement.style.setProperty('--theme-hue', hue.toString());
};

export const setLang = (language: string) => {
  i18n.changeLanguage(language);

  localStorage.setItem('language', language);
  if (isRtlLang(language)) {
    document.querySelector('#main-app').classList.add('rtl');
  } else {
    document.querySelector('#main-app').classList.remove('rtl');
  }
};

export const isRtlLang = (language: string) => {
  const rtlLanguages = ['he', 'ar', 'ur'];
  return rtlLanguages.includes(language);
};

export const setTheme = (theme: number) => {
  localStorage.setItem('dark-mode', theme.toString());
  switch (theme) {
    case 0:
      document.body.classList.remove('dark-mode');
      break;

    case 1:
      document.body.classList.add('dark-mode');
      break;
  }
};

const Application = () => {
  const [language, setLanguage] = useState('en');
  const [darkTheme, setDarkTheme] = useState(true);
  const [colorTheme, setColorTheme] = useState('');

  useEffect(() => {
    const useDarkTheme = parseInt(localStorage.getItem('dark-mode'));
    if (isNaN(useDarkTheme)) {
      setDarkTheme(true);
    } else if (useDarkTheme == 1) {
      setDarkTheme(true);
    } else if (useDarkTheme == 0) {
      setDarkTheme(false);
    }

    if (!localStorage.getItem('all-tags'))
      localStorage.setItem('all-tags', JSON.stringify([]));

    if (!localStorage.getItem('color')) localStorage.setItem('color', 'blue');
    setColorTheme(localStorage.getItem('color'));

    if (!localStorage.getItem('language'))
      localStorage.setItem('language', 'he');
    setLanguage(localStorage.getItem('language'));
  }, []);

  useEffect(() => {
    if (darkTheme) {
      setTheme(1);
    } else {
      setTheme(0);
    }
  }, [darkTheme]);

  useEffect(() => {
    setLang(language);
  }, [language]);

  useEffect(() => {
    switch (colorTheme) {
      case 'red':
        setColor('red', 0);
        break;
      case 'yellow':
        setColor('yellow', 35);
        break;
      case 'green':
        setColor('green', 140);
        break;
      case 'blue':
        setColor('blue', 210);
        break;
      case 'purple':
        setColor('purple', 250);
        break;
      case 'pink':
        setColor('pink', 300);
        break;

      default:
        break;
    }
  }, [colorTheme]);

  return (
    <GeneralContextProvider>
      <KBarProvider
        actions={actions}
        options={{ toggleShortcut: '$mod+Shift+p' }}
      >
        <div id='main-app'>
          <Header />
          <div className='workspace'>
            <FilesSidebar />
            <CommandBar />
            <Page />
            <MathSidebar />
          </div>
        </div>
      </KBarProvider>
    </GeneralContextProvider>
  );
};

export default Application;
