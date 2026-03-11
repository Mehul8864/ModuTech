// hooks/useNavigation.js
import { useRef, useEffect, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../authSlice";

const useNavigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth?.user);
  const dropdownRef = useRef(null);

  // toggle class 'open' on the dropdown element (attach ref to the dropdown DOM node)
  const toggleDropdown = useCallback(() => {
    const el = dropdownRef.current;
    if (!el) return;
    el.classList.toggle("open");
  }, []);

  const closeDropdown = useCallback(() => {
    const el = dropdownRef.current;
    if (!el) return;
    el.classList.remove("open");
  }, []);

  // close when clicking outside or pressing Escape
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const el = dropdownRef.current;
      if (!el) return;
      if (!el.contains(e.target)) closeDropdown();
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeDropdown();
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDropdown]);

  // sign out user
  const userSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      navigate("/signin");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }, [dispatch, navigate]);

  return { authUser, userSignOut, toggleDropdown, closeDropdown, dropdownRef };
};

export default useNavigation;