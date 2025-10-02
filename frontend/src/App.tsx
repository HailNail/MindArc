import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import "./styles.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";

const App = () => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Theme appearance="inherit" accentColor="teal" grayColor="sage">
          <ToastContainer
            theme="inherit"
            toastStyle={{
              backgroundColor: "var(--toast-bg)",
              color: "var(--toast-text)",
            }}
            closeButton={false}
            closeOnClick={true}
          />
          <Layout />
        </Theme>
      </ThemeProvider>
    </>
  );
};

export default App;
