import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View, Keyboard } from "react-native";
import styles from "../../Styles/styles";
import ChatHeader from "../../Components/Chat/ChatHeader";
import ChatBubble from "../../Components/Chat/ChatBubble";
import ChatInput from "../../Components/Chat/ChatInput";
import { getChatMessages } from "../../API/api";
import { useSelector } from "react-redux";
import { RootStore } from "../../Redux/store";

export type ChatBubbleType = {
	authorId: string;
	content: string;
	date: string;
};

const ChatScreen = ({ route }) => {
	const { socket } = useSelector(
		(state: RootStore) => state.applicationReducer
	);

	const { chatId, messageWith, profilePicture, recipentId } = route.params;

	const [keyboardOffset, setKeyboardOffset] = useState<number>(0);

	const [chats, setChats] = useState<ChatBubbleType[]>([]);
	const [text, setText] = useState<string>("");

	const [firstLoad, setFirstLoad] = useState<boolean>(false);

	const scrollViewRef = useRef(null);
	const handleKeyboardShow = (e: any) => {
		setKeyboardOffset(e.endCoordinates.height);
	};

	const handleKeyboardHide = () => {
		setKeyboardOffset(0);
	};

	const handleChat = () => {
		socket.send(
			JSON.stringify({
				type: "send_notification",
				payload: recipentId,
			})
		);
	};

	useEffect(() => {
		(async () => {
			const { data } = await getChatMessages(chatId);

			setChats(data.reverse());

			// so that the screen only scrolls after all the contents have been loaded.
			setFirstLoad(true);
		})();
	}, []);

	// scroll to bottom of chat by default
	useEffect(() => {
		if (!scrollViewRef.current || !firstLoad) return;

		scrollViewRef.current.scrollToEnd({ animated: false });
	}, [scrollViewRef, firstLoad]);

	useEffect(() => {
		Keyboard.addListener("keyboardDidShow", handleKeyboardShow);
		Keyboard.addListener("keyboardDidHide", handleKeyboardHide);

		return () => {
			Keyboard.removeAllListeners("keyboardDidShow");
			Keyboard.removeAllListeners("keyboardDidHide");
		};
	}, []);

	return (
		<View style={styles.fullContainer}>
			<ChatHeader chatId={chatId} messageWith={messageWith} />

			<ScrollView ref={scrollViewRef} style={{ marginBottom: 50 }}>
				<View style={{ marginTop: 10, paddingBottom: keyboardOffset }}>
					{chats.map((chat: ChatBubbleType, index: number) => {
						// check if the last message was sent by the same user, so that only one avatar is displayed.
						const sameUser: boolean =
							index - 1 >= 0 &&
							chats[index].authorId === chats[index - 1].authorId;

						return (
							<ChatBubble
								key={index}
								chat={chat}
								sameUser={sameUser}
								profilePicture={profilePicture}
							/>
						);
					})}
				</View>
			</ScrollView>

			<ChatInput
				text={text}
				setText={setText}
				keyboardOffset={keyboardOffset}
				handleChat={handleChat}
			/>
		</View>
	);
};

export default ChatScreen;
