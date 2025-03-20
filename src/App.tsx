import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './components/providers/ThemeProvider';
import { router } from './Routes';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Helmet titleTemplate="%s | GymEvolution" />
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
