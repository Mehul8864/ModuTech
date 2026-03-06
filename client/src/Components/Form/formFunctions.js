// formFunctions.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { createGadget } from "../../actions/gadgets";
import { auth } from "../../firebase";
import { selectUser } from "../../authSlice";
import useStyles from "./styles";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

const useFormFunctions = () => {
  const [authUser, setAuthUser] = useState(null);
  const dispatch = useDispatch();
  const storedUser = useSelector(selectUser);
  const classes = useStyles();

  // If your reducer uses a named slice, replace this selector with the correct path.
  // Keep defensive: only merge fields that exist.
  const gadgetState = useSelector((state) => state.gadget || state.gadgets || state);

  const [gadgetData, setGadgetData] = useState({
    title: "",
    message: "",
    selectedFile: "",
    creator: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Firebase auth listener — unsubscribe properly on cleanup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      // unsubscribe is a function returned by onAuthStateChanged
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // If your gadgetState contains values that should pre-fill the form,
  // merge them defensively into gadgetData. Avoid blindly overwriting.
  useEffect(() => {
    if (!gadgetState) return;

    // If gadgetState looks like an object with expected fields, merge
    const allowedKeys = ["title", "message", "selectedFile", "creator"];
    const partial = {};

    allowedKeys.forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(gadgetState, k) && gadgetState[k] != null) {
        partial[k] = gadgetState[k];
      }
    });

    if (Object.keys(partial).length > 0) {
      setGadgetData((prev) => ({ ...prev, ...partial }));
    }
  }, [gadgetState]);

  const handleImageChange = useCallback((e) => {
    const file = e?.target?.files?.[0] || null;
    setImage(file);
  }, []);

  // Returns the image URL (string) if uploaded, else null
  const handleImageUpload = useCallback(async () => {
    setError(null);

    if (!image) {
      return null;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      // Attach token if available (prefer authUser from firebase, otherwise storedUser.token if you store one)
      let token = null;
      try {
        if (authUser && typeof authUser.getIdToken === "function") {
          token = await authUser.getIdToken();
        } else if (storedUser?.token) {
          token = storedUser.token;
        }
      } catch (tErr) {
        // token resolution failed, continue without token but log
        //console.warn("Failed to obtain token for upload", tErr);
      }

      const headers = {
        // Let the browser set the correct multipart boundary header; axios will set it automatically
        // but adding Content-Type explicitly is OK too: 'multipart/form-data'
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(`${API_BASE}/gadgets/upload`, formData, {
        headers,
      });

      // Expecting { imageUrl: '...' } or similar from backend
      const imageUrl = response?.data?.imageUrl || response?.data?.url || null;

      if (imageUrl) {
        // Set selectedFile in gadgetData so subsequent submit will include it
        setGadgetData((prev) => ({ ...prev, selectedFile: imageUrl }));
        return imageUrl;
      } else {
        throw new Error("Upload succeeded but no image URL returned");
      }
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      setError(uploadError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [image, authUser, storedUser]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      setError(null);

      // Check authentication (firebase user or storedUser from redux)
      if (!authUser && !storedUser) {
        alert("Please sign in to create a gadget.");
        return;
      }

      setLoading(true);
      try {
        // If there is an image selected but not yet uploaded, upload first and update gadgetData
        if (image && !gadgetData.selectedFile) {
          const uploadedUrl = await handleImageUpload();
          // if upload failed, stop submission
          if (!uploadedUrl && image) {
            throw new Error("Image upload failed — cannot submit gadget");
          }
        }

        // Ensure creator is set (prefer storedUser info, otherwise firebase user email/uid)
        const creator =
          gadgetData.creator ||
          storedUser?.username ||
          storedUser?.name ||
          authUser?.displayName ||
          authUser?.email ||
          authUser?.uid ||
          "";

        const payload = {
          ...gadgetData,
          creator,
        };

        // Optionally attach token to request in your action creator if it expects it.
        // Here we just dispatch the action; ensure createGadget accepts the shape you send.
        dispatch(createGadget(payload));

        // Optionally reset form state (if desired)
        // setGadgetData({ title: "", message: "", selectedFile: "", creator: "" });
        // setImage(null);
      } catch (submitErr) {
        console.error("Failed to create gadget:", submitErr);
        setError(submitErr);
      } finally {
        setLoading(false);
      }
    },
    [authUser, storedUser, image, gadgetData, dispatch, handleImageUpload]
  );

  return {
    authUser,
    storedUser,
    classes,
    gadgetData,
    setGadgetData,
    image,
    setImage,
    handleImageChange,
    handleImageUpload,
    handleSubmit,
    loading,
    error,
  };
};

export default useFormFunctions;