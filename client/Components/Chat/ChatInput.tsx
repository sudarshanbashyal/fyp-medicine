import React, { SetStateAction, Dispatch, useEffect, useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Image,
} from "react-native";
import {
	Asset,
	ImagePickerResponse,
	launchImageLibrary,
} from "react-native-image-picker";
import { ImagePreviewType } from "../../Screens/Chat/ChatScreen";
import { colors } from "../../Styles/Colors";
import styles from "../../Styles/styles";
import { CancelIcon, ImageIcon, SendIcon } from "../../Styles/SVG/Svg";

const ChatInput = ({
	keyboardOffset,
	text,
	handleChat,
	setText,
	imageInfo,
	setImageInfo,
	inputActive,
	setInputActive,
}: {
	keyboardOffset: number;
	text: string;
	setText: any;
	handleChat: any;
	imageInfo: ImagePreviewType | null;
	setImageInfo: Dispatch<SetStateAction<ImagePreviewType | null>>;
	inputActive: boolean;
	setInputActive: Dispatch<SetStateAction<boolean>>;
}) => {
	const [imagePreviewStyling, setImagePreviewStyling] = useState(
		styles.chatInput
	);

	const handleImagePreview = async () => {
		const imageResponse: ImagePickerResponse = await launchImageLibrary({
			mediaType: "photo",
			includeBase64: true,
		});

		if (!imageResponse.didCancel) {
			const imageAsset: Asset = imageResponse.assets[0];

			setImageInfo({
				base64: imageAsset.base64,
				uri: imageAsset.uri,
				fileName: imageAsset.fileName,
			});

			setText("");
			setInputActive(true);
			handleImagePreviewStyling();
		}
	};

	const handleImagePreviewStyling = () => {
		const additionalStyles = StyleSheet.create({
			expandedInput: {
				height: 150,
			},
		});

		setImagePreviewStyling({
			...styles.chatInput,
			...additionalStyles.expandedInput,
		});
	};

	const removeImagePreview = () => {
		setImagePreviewStyling(styles.chatInput);
		setInputActive(false);
		setImageInfo(null);
	};

	const handleTextChange = (e) => {
		const { text } = e.nativeEvent;
		setText(text);
	};

	useEffect(() => {
		if (!inputActive) {
			removeImagePreview();
		}
	}, [inputActive]);

	useEffect(() => {
		if (text.length > 0) {
			setInputActive(true);
			return;
		}

		setInputActive(false);
	}, [text]);

	return (
		<View style={{ ...styles.chatInputContainer, bottom: keyboardOffset }}>
			{!inputActive && (
				<View style={{ marginRight: 10 }}>
					<TouchableOpacity onPress={handleImagePreview}>
						<ImageIcon size={24} color={colors.primaryWhite} />
					</TouchableOpacity>
				</View>
			)}

			<TextInput
				value={text}
				onChange={(e) => {
					handleTextChange(e);
				}}
				multiline={true}
				style={imagePreviewStyling}
				editable={!imageInfo}
				selectTextOnFocus={!imageInfo}
			/>

			{imageInfo && (
				<View style={styles.chatInputPreviewContainer}>
					<View style={styles.chatInputImageContainer}>
						<Image
							style={styles.chatInputImage}
							source={{ uri: imageInfo?.uri || null }}
						/>
					</View>

					<TouchableOpacity
						onPress={removeImagePreview}
						style={styles.chatImageRemove}
					>
						<CancelIcon color={colors.primaryRed} size={34} />
					</TouchableOpacity>
				</View>
			)}

			{inputActive && (
				<View style={{ marginLeft: 10 }}>
					<TouchableOpacity onPress={handleChat}>
						<SendIcon size={26} color={colors.primaryRed} />
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default ChatInput;
