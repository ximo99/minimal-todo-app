import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addTodoReducer } from "../redux/todosSlices";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

function AddTodo() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [isToday, setIsToday] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const listTodos = useSelector((state) => state.todos.todos);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const addTodo = async () => {
    const newTodo = {
      id: Math.floor(Math.random() * 1000000),
      text: name,
      hour: date.toString(),
      isToday: isToday,
      isComplited: false,
    };
    try {
      await AsyncStorage.setItem(
        "@Todos",
        JSON.stringify([...listTodos, newTodo])
      );
      dispatch(addTodoReducer(newTodo));
      console.log("Todo saved correctly");
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };
  const handleConfirmTime = (selectedDate) => {
    setShowTimePicker(false);
    setDate(selectedDate || date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Task</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Name</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Task"
          placeholderTextColor="#00000030"
          onChangeText={(text) => {
            setName(text);
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Hour</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)}>
          <Text style={[styles.textInput, styles.timeText]}>
            {date.toLocaleTimeString([], {
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode={"time"}
          is24Hour={true}
          onChange={(event, selectedDate) => handleConfirmTime(selectedDate)}
          style={{ width: "100%" }}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Today</Text>
        <Switch
          value={isToday}
          onValueChange={(value) => {
            setIsToday(value);
          }}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={addTodo}>
        <Text style={{ color: "white" }}>Done</Text>
      </TouchableOpacity>

      <Text style={{ color: "#00000060" }}>
        If you disable today, the task will be consider as tomorrow
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 35,
    marginTop: 10,
  },
  inputTitle: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
  },
  textInput: {
    borderBottomColor: "#00000030",
    borderBottomWidth: 1,
    width: "80%",
  },
  inputContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 30,
  },
  timeText: {
    width: "100%",
    backgroundColor: "#d4d4d4",
    borderRadius: 4,
    padding: 5,
  },
  button: {
    marginTop: 30,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    height: 46,
    borderRadius: 11,
  },
});

export default AddTodo;
