import { auth, database, googleprovider } from '../config/firebase';
import { useState, useEffect } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import googlepic from '../assets/Googlepic.png';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import './signin.css';

const Signin = () => {
    const [username, setusername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const signInWithGoogle = async () => {
        if (!username) {
            alert("Please enter username");
            return;
        }
        try {
            await signInWithPopup(auth, googleprovider);
            addUser();
            navigate("/home");
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            alert("Error signing in with Google. Please try again.");
        }
    };

    const addUser = async () => {
        const userRef = collection(database, "Users");
        const userDocRef = doc(userRef, auth.currentUser.uid);

        try {
            const docSnap = await getDoc(userDocRef);

            if (!docSnap.exists()) {
                await setDoc(userDocRef, {
                    username: username,
                    email: auth.currentUser.email,
                });
            }
        } catch (err) {
            console.error("Error adding user:", err);
        }
    };

    return (
        <div className="signin-root">
            <div className="signin-container">
                <h2 className="signin-title">Sign In</h2>
                <p className="signin-subtitle">Enter your username to continue</p>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setusername(e.target.value)}
                    placeholder="Username"
                    className="signin-input"
                />
                <button 
                    onClick={signInWithGoogle}
                    className="signin-button"
                >
                    <img 
                        src={googlepic} 
                        alt="Google"
                        className="signin-google-icon"
                    />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Signin;
