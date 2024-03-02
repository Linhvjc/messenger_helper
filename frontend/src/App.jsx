import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import useConversation from "./zustand/useConversation";
import useGetConversations from "./hooks/useGetConversations";

function App() {
	const { authUser } = useAuthContext();

	const { selectedConversation, setSelectedConversation } = useConversation();
	const { loading, conversations } = useGetConversations();

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.keyCode === 27) {
				// Text to speech the sentence "Who do you want to move the conversation to?"
				const message = new SpeechSynthesisUtterance("Who do you want to move the conversation to?");

				// Change voice to a female voice
				const voices = window.speechSynthesis.getVoices();
				const femaleVoice = voices.find((voice) => voice.name === "Google UK English Female");
				if (femaleVoice) {
					message.voice = femaleVoice;
				}

				window.speechSynthesis.speak(message);

				// Time sleep in 7s
				setTimeout(() => {
					const message2 = new SpeechSynthesisUtterance("Switch to username is monkey");
					if (femaleVoice) {
						message2.voice = femaleVoice;
					}
					window.speechSynthesis.speak(message2);
				}, 6000);

				setTimeout(() => {
					let dummy = "monkey";
					for (const element of conversations) {
						if (element.fullName === dummy) {
							setSelectedConversation(element);
						}
					}
				}, 10000);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [conversations]); // Add conversations as a dependency to the useEffect hook

	return (
		<div className="p-4 h-screen flex items-center justify-center">
			<Routes>
				<Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
				<Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
				<Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;