import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [selectedImage, setSelectedImage] = useState(null);
	const { loading, sendMessage } = useSendMessage();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message) {
			return;
		}
		await sendMessage(message);
		setMessage("");
	};

	const handleFileSelect = async (e) => {
		const file = e.target.files[0];
		// Do something with the selected file, such as uploading it
		console.log("Selected file:", file);

		// Send the file to the API endpoint
		const formData = new FormData();
		formData.append("file", file);

		// Set the selected image to display below the input
		// setSelectedImage(URL.createObjectURL(file));

		try {
			const response = await fetch("https://30e4-167-179-48-114.ngrok-free.app/message/image", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Image upload failed");
			}

			const data = await response.json();
			console.log("API response:", data);
			// Display the API response
			await sendMessage(data['image_url'] + "|||" + data['audio_url']);
			setMessage("");

		} catch (error) {
			console.error("Error:", error);
			// Handle the error
		}
	};

	return (
		<form className="px-4 my-3" onSubmit={handleSubmit}>
			<div className="w-full relative">
				<label htmlFor="file-input" className="px-4 py-2 rounded-lg cursor-pointer">
					Attach file
				</label>
				<input
					id="file-input"
					type="file"
					className="hidden"
					onChange={handleFileSelect}
				/>
				<input
					type="text"
					className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
					placeholder="Send a message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3">
					{loading ? <div className="loading loading-spinner"></div> : <BsSend />}
				</button>
			</div>
			{selectedImage && <img src={selectedImage} alt="Selected" style={{ marginTop: '6px', height: '80px', position: 'absolute', bottom: '75px' }} />}
		</form>
	);
};

export default MessageInput;