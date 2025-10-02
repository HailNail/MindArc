import { Button, Flex, Text, Box } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  pinned: boolean;
  extension?: React.ReactNode;
  isOpen: boolean;
  mobileVersion: boolean;
};

const MotionFlex = motion(Flex);

const NavItem = ({
  icon,
  label,
  expanded,
  pinned,
  extension,
  isOpen,
  mobileVersion,
}: NavItemProps) => {
  return (
    <MotionFlex
      p="2"
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Box position="relative" mr="2" className="cursor-pointer">
        <AnimatePresence>
          {isOpen ? (
            <motion.span
              key={`${label}-icon-extension`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Text color="teal" mr="2">
                {icon}
              </Text>
              {extension}
            </motion.span>
          ) : mobileVersion ? (
            <></>
          ) : (
            <>
              <Text color="teal" mr="2">
                {icon}
              </Text>
              {extension}
            </>
          )}
        </AnimatePresence>
      </Box>
      <AnimatePresence>
        {(expanded || pinned || isOpen) && (
          <motion.span
            key={label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36 }}
          >
            <Text
              color="teal"
              className="font-medium cursor-pointer"
              mt="1"
              size="2"
              asChild
            >
              <span>{label}</span>
            </Text>
          </motion.span>
        )}
      </AnimatePresence>
    </MotionFlex>
  );
};

export default NavItem;
