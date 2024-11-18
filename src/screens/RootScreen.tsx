import { BrowserRouter } from "react-router-dom";
import { Navigation } from "./Navigation";
import { ThemeProvider } from "@/providers/ThemeProvider";

export const RootScreen: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ThemeProvider defaultTheme="dark">
        <Navigation />
      </ThemeProvider>
    </BrowserRouter>
  );
};
