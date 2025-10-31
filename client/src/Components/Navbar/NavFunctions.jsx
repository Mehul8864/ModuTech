// NavFunctions.js
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../../authSlice";

const useNavigation = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.auth.user);

    const toggleDropdown = () => {
        var dropdown = document.getElementById("profile-dropdown");
        dropdown.style.display =
            dropdown.style.display === "block" ? "none" : "block";
    };

    const userSignOut = () => {
        signOut(auth)
            .then(() => {
                console.log("sign out successful");
                dispatch(clearUser());
                history("/signin");
            })
            .catch((error) => console.log(error));
    };

    return { authUser, userSignOut, toggleDropdown };
};

export default useNavigation;