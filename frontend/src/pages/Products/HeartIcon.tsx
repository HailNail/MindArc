import { useAppDispatch, useAppSelector } from "../../types/hooks";
import {
  addFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";
import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";
import type { Product } from "../../types/productTypes";
import { useEffect } from "react";
import { Box } from "@radix-ui/themes";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";

interface ProductProps {
  product: Product;
}

const MotionBox = motion(Box);

const HeartIcon = ({ product }: ProductProps) => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      // remove the product from the localStorage as well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addFavorites(product));
      //add th product to the localStorage as well
      addFavoriteToLocalStorage(product);
    }
  };
  return (
    <MotionBox
      onClick={toggleFavorites}
      position="absolute"
      top="2"
      right="2"
      className="cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {isFavorite ? (
        <FaHeart className="text-[var(--ruby-10)]" />
      ) : (
        <FaRegHeart className="text-[var(--teal-10)]" />
      )}
    </MotionBox>
  );
};

export default HeartIcon;
