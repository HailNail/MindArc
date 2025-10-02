import { Flex, Box, Heading, IconButton } from "@radix-ui/themes";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import HelmetIcon from "../assets/icon.svg?react";
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";

interface AppHeaderProps {
  isSidebarOpen: boolean;
  isAtTop: boolean;
  toggleSidebar: () => void;
}

const MotionFlex = motion(Flex);

const AppHeader = ({
  isSidebarOpen,
  toggleSidebar,
  isAtTop,
}: AppHeaderProps) => {
  const headerHeight = isAtTop ? 9 : 0;
  return (
    <>
      <MotionFlex
        position="fixed"
        top="0"
        right="0"
        align="center"
        width="100vw"
        px="4"
        py="5"
        className="z-40 bg-[var(--gray-4)]"
        animate={{ height: headerHeight, opacity: isAtTop ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Box display={{ initial: "block", md: "none" }} mt="2">
          <IconButton onClick={toggleSidebar} variant="ghost">
            {isSidebarOpen ? <Cross1Icon /> : <HamburgerMenuIcon />}
          </IconButton>
        </Box>

        <Flex p="1" width="100%" justify="center">
          <HelmetIcon color="var(--teal-9)" width={32} height={32} />
          <Heading
            style={{
              fontFamily: "Permanent Marker, serif",
              color: "var(--teal-9)",
            }}
            ml="2"
          >
            MIND ARC
          </Heading>
        </Flex>

        <ThemeToggle />
      </MotionFlex>
    </>
  );
};

export default AppHeader;
