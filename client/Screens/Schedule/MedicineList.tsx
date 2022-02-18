import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import BottomNavigationBar from "../../Components/BottomNavigationBar";
import MedicineListElement from "../../Components/Schedule/MedicineListElement";
import { RootStackType } from "../../Stacks/RootStack";
import styles from "../../Styles/styles";
import { getMedicineList } from "../../API/api";
import MedicineListSkeleton from "../../Components/Skeletons/MedicineListSkeleton";
import NoData from "../../Components/Feedbacks/NoData";

const MedicineList = () => {
	const navigation = useNavigation<NavigationProp<RootStackType>>();

	const [isLoading, setIsLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(null);
	const [items, setItems] = useState([]);

	const [medicineList, setMedicineList] = useState<
		{
			id: string;
			name: string;
			status: string;
			frequency: number;
			days: number[];
		}[]
	>([]);

	const [renderMedicineList, setRenderMedicineList] = useState([]);

	const handleNaviation = (name: keyof RootStackType) => {
		navigation.navigate(name);
	};

	const getAllMedicines = async () => {
		const newMedicineList = [];
		const allMedicines = await getMedicineList();

		if (allMedicines) {
			const { data } = allMedicines;

			data.forEach((med: any) => {
				newMedicineList.push({
					id: med.medicineId as string,
					name: med.name as string,
					status: med.active === true ? "active" : "inactive",
					frequency: med.frequencies[0].frequencyPerWeek,
					days: med.days,
				});
			});

			setMedicineList(newMedicineList);
		}

		// set isloading false
		setIsLoading(false);
	};

	const changeRenderList = (e: string) => {
		if (e === "all") {
			setRenderMedicineList(medicineList);
			return;
		}

		const newList = medicineList.filter(
			(medicine) => medicine.status === e
		);

		setRenderMedicineList(newList);
	};

	useEffect(() => {
		setRenderMedicineList(medicineList);
	}, [medicineList]);

	useEffect(() => {
		getAllMedicines();

		setItems([
			{ label: "All Medicine", value: "all" },
			{ label: "Active", value: "active" },
			{ label: "Inactive", value: "inactive" },
		]);
		setValue("all");
	}, []);

	return (
		<View style={styles.fullContainer}>
			<ScrollView style={styles.medicineListContainer}>
				<Text style={styles.chatTitle}>My Medicine List</Text>

				<View style={styles.medicineListActions}>
					<View style={{ width: 150 }}>
						<DropDownPicker
							placeholder=""
							style={styles.lineGraphDropdown}
							theme="DARK"
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							onChangeValue={changeRenderList}
						/>
					</View>

					<TouchableOpacity
						style={{ ...styles.blueButtonContainer, width: 150 }}
						onPress={() => {
							handleNaviation("ScheduleDetails");
						}}
					>
						<Text style={styles.blueButton}>Add Medicine</Text>
					</TouchableOpacity>
				</View>

				{isLoading ? (
					<MedicineListSkeleton />
				) : renderMedicineList.length > 0 ? (
					<View style={styles.medicineLists}>
						{renderMedicineList.map((medicine) => (
							<MedicineListElement
								key={medicine.id}
								medicine={medicine}
							/>
						))}
					</View>
				) : (
					<NoData />
				)}
			</ScrollView>

			<BottomNavigationBar />
		</View>
	);
};

export default MedicineList;
