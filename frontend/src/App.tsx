import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import "./styles.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "./components/Layout";

const App = () => {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
