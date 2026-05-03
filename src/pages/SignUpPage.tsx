import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

const SignUpPage = () => {
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            window.location.href = "/profile";
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full mt-20 flex flex-col items-center gap-10">
            <h1 className="text-whiteMain font-poppins text-[36px] font-semibold leading-[120%]">
                Create your account
            </h1>

            <button
                onClick={() => signInWithGoogle()}
                className="flex justify-evenly gap-5 items-center bg-whiteMain px-4 py-2 rounded-[5px] cursor-pointer"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    alt="Google Logo"
                    className="w-10"
                />
                <p className="text-bgMain font-poppins font-semibold ">
                    Sign Up With Google
                </p>
            </button>
        </div>
    );
};

export default SignUpPage;
