import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInSuccess,
  singInStart,
} from "../redux/user/userSlice";

export default function OAuth() {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.user);

  const handleGoogle = async () => {
    try {
      dispatch(singInStart(loading));
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const resAut = await signInWithPopup(auth, provider);

      const res = await fetch(`${import.meta.VITE_API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resAut.user.displayName,
          email: resAut.user.email,
          photo: resAut.user.photoURL,
        }),
      });
      const data = await res.json();

      dispatch(signInSuccess(data));
    } catch (err) {
      dispatch(signInFailure(err?.error ?? String(err)));
      console.log("Could not sign in with google", error);
    }
  };

  return (
    <button
      onClick={handleGoogle}
      type="button"
      className="btn bg-[#A50E0E] mt-4 w-full"
    >
      Continue With Google
    </button>
  );
}
