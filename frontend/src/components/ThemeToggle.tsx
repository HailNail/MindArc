import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { IconButton, Box } from "@radix-ui/themes";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Box position="absolute" top="4" right="4">
      <IconButton onClick={handleThemeChange} variant="ghost" color="amber">
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.span
              key="moon" // Unique key for Moon
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <MoonIcon />
            </motion.span>
          ) : (
            <motion.span
              key="sun" // Unique key for Sun
              initial={{ opacity: 0, rotate: 180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <SunIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </IconButton>
    </Box>
  );
}

export default ThemeToggle;
