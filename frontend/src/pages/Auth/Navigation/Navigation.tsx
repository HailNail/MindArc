import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../../redux/api/usersApiSlice";
import { logout } from "../../../redux/features/auth/authSlice";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { type RootState } from "../../../redux/store";

import {
  AiOutlineHeart,
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineUserAdd,
} from "react-icons/ai";

import NavItem from "./NavItem";
import {
  Box,
  Flex,
  Button,
  Text,
  DropdownMenu,
  IconButton,
} from "@radix-ui/themes";
import FavoritesCount from "../../Products/FavoritesCount";
import CartCount from "../../CartCount";

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: () => void;
  mobileVersion: boolean;
  isAtTop: boolean;
  sidebarRef: React.Ref<HTMLDivElement>;
}

const MotionFlex = motion(Flex);
const MotionButton = motion(Button);
const MotionButtonIcon = motion(IconButton);
const MotionContent = motion(DropdownMenu.Content);
const MotionItem = motion(DropdownMenu.Item);

const variants = {
  hidden: { opacity: 0, scale: 0.8, y: 5, pointerEvents: "none" },
  visible: { opacity: 1, scale: 1, y: 0, pointerEvents: "auto" },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: { opacity: 0, scale: 0.95, y: -10 },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const Navigation = ({
  isOpen,
  setIsOpen,
  mobileVersion,
  isAtTop,
  sidebarRef,
}: NavigationProps) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const destination =
    userInfo?.loginType === "google" ? "/user-orders" : "/profile";

  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);

  const sidebarWidth = pinned
    ? "15%" // force open when pinned
    : expanded
    ? "15%" // expand on hover
    : "5%";
  const desktopTopOffset = isAtTop ? 48 : 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MotionFlex
      direction="column"
      justify="between"
      align="start"
      p="2"
      height={{ initial: "50%", md: "100vh" }}
      ref={sidebarRef}
      className={`fixed z-50`}
      style={{
        background: "var(--gray-4)",
        top: isAtTop ? desktopTopOffset : 0,
        height: isAtTop ? `calc(100vh - ${desktopTopOffset}px)` : "100vh",
      }}
      onMouseEnter={() => {
        !mobileVersion && !pinned && setExpanded(true);
      }}
      onMouseLeave={() => {
        !mobileVersion && !pinned && setExpanded(false);
      }}
      animate={{
        width: isOpen ? "50%" : sidebarWidth,
        display: (mobileVersion && isOpen) || !mobileVersion ? "flex" : "none",
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Navigation Items */}
      <MotionFlex direction="column" gapY="4" mt="6">
        <Link to="/">
          <NavItem
            icon={<AiOutlineHome size={26} />}
            label="HOME"
            expanded={expanded}
            pinned={pinned}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            mobileVersion={mobileVersion}
          />
        </Link>
        <Link to="/shop">
          <NavItem
            icon={<AiOutlineShopping size={26} />}
            label="SHOP"
            expanded={expanded}
            pinned={pinned}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            mobileVersion={mobileVersion}
          />
        </Link>
        <Link to="/cart">
          <NavItem
            icon={<AiOutlineShoppingCart size={26} />}
            label="CART"
            expanded={expanded}
            pinned={pinned}
            extension={<CartCount />}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            mobileVersion={mobileVersion}
          />
        </Link>
        <Link to="/favorite">
          <NavItem
            icon={<AiOutlineHeart size={26} />}
            label="FAVORITES"
            expanded={expanded}
            pinned={pinned}
            extension={<FavoritesCount />}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            mobileVersion={mobileVersion}
          />
        </Link>
      </MotionFlex>
      <Box position="relative" mb="3">
        <Flex align="center">
          <DropdownMenu.Root
            onOpenChange={(open) => {
              if (open) {
                setPinned(true);
              } else {
                setPinned(false);
                setExpanded(false);
              }
            }}
          >
            <AnimatePresence mode="wait">
              {userInfo ? (
                expanded || pinned || isOpen ? (
                  <DropdownMenu.Trigger>
                    <MotionButton
                      variant="surface"
                      ml="2"
                      mb="4"
                      key="button"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={variants}
                      transition={{ duration: 0.15, ease: "linear" }}
                    >
                      {userInfo.username}
                      <DropdownMenu.TriggerIcon />
                    </MotionButton>
                  </DropdownMenu.Trigger>
                ) : (
                  <MotionButtonIcon
                    key="buttonIcon"
                    variant="outline"
                    initial="hidden"
                    animate={!mobileVersion ? "visible" : "hidden"}
                    exit="hidden"
                    variants={variants}
                    transition={{ duration: 0.15, ease: "linear" }}
                  >
                    <Text size="3" weight="bold">
                      {userInfo.username.charAt(0).toUpperCase()}
                    </Text>
                  </MotionButtonIcon>
                )
              ) : (
                <></>
              )}
            </AnimatePresence>
            <AnimatePresence>
              <MotionContent
                variant="soft"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {userInfo?.isAdmin && (
                  <>
                    <MotionItem asChild>
                      <Link to={"/admin/dashboard"}>
                        <motion.div
                          className="cursor-pointer"
                          variants={itemVariants}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Dashboard
                        </motion.div>
                      </Link>
                    </MotionItem>
                    <MotionItem asChild>
                      <Link to={"/admin/productlist"}>
                        <motion.div
                          className="cursor-pointer"
                          variants={itemVariants}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Products
                        </motion.div>
                      </Link>
                    </MotionItem>
                    <MotionItem asChild>
                      <Link to={"/admin/categorylist"}>
                        <motion.div
                          className="cursor-pointer"
                          variants={itemVariants}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Category
                        </motion.div>
                      </Link>
                    </MotionItem>
                    <MotionItem asChild>
                      <Link to={"/admin/orderlist"}>
                        <motion.div
                          className="cursor-pointer"
                          variants={itemVariants}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Orders
                        </motion.div>
                      </Link>
                    </MotionItem>
                    <MotionItem asChild>
                      <Link to={"/admin/userlist"}>
                        <motion.div
                          className="cursor-pointer"
                          variants={itemVariants}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Users
                        </motion.div>
                      </Link>
                    </MotionItem>
                  </>
                )}
                <MotionItem asChild>
                  <Link to={destination}>
                    <motion.div
                      className="cursor-pointer"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Profile
                    </motion.div>
                  </Link>
                </MotionItem>
                <MotionItem asChild>
                  <motion.div
                    className="cursor-pointer"
                    variants={itemVariants}
                    onClick={logoutHandler}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.div>
                </MotionItem>
              </MotionContent>
            </AnimatePresence>
          </DropdownMenu.Root>
        </Flex>
      </Box>
      {!userInfo && (
        <MotionFlex direction="column" gapY="4" mb="3">
          <Link to="/login">
            <NavItem
              icon={<AiOutlineLogin size={26} />}
              label="Login"
              expanded={expanded}
              pinned={pinned}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              mobileVersion={mobileVersion}
            />
          </Link>
          <Link to="/register">
            <NavItem
              icon={<AiOutlineUserAdd size={26} />}
              label="Register"
              expanded={expanded}
              pinned={pinned}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              mobileVersion={mobileVersion}
            />
          </Link>
        </MotionFlex>
      )}
    </MotionFlex>
  );
};

export default Navigation;
