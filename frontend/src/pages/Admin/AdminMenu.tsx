import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaListUl, FaTimes } from "react-icons/fa";
import { IconButton, Section } from "@radix-ui/themes";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenyOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenyOpen(!isMenuOpen);
  };
  return (
    <div className="top-4 md:top-16 right-12 md:right-4 absolute md:fixed z-40">
      <IconButton variant="ghost" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaListUl />}
      </IconButton>

      {isMenuOpen && (
        <Section
          position="fixed"
          py="3"
          px="2"
          mr="2"
          right="6"
          top="3rem"
          className="bg-[var(--gray-3)]  rounded-lg"
        >
          <ul className="list-none mt-2">
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-[var(--blue-6)] rounded-sm"
                to="/admin/dashboard"
              >
                Admin Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-[var(--blue-6)] rounded-sm"
                to="/admin/categorylist"
              >
                Create Category
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-[var(--blue-6)] rounded-sm"
                to="/admin/productlist"
              >
                Create Product
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-[var(--blue-6)] rounded-sm"
                to="/admin/allproducts"
              >
                All Products
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-[var(--blue-6)] rounded-sm"
                to="/admin/userlist"
              >
                Manage Users
              </NavLink>
            </li>
            <li>
              <NavLink
                className="list-item py-2 px-3 hover:bg-[var(--blue-6)] rounded-sm"
                to="/admin/orderlist"
              >
                Manage Orders
              </NavLink>
            </li>
          </ul>
        </Section>
      )}
    </div>
  );
};

export default AdminMenu;
