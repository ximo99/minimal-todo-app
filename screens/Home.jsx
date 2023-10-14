import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { todosData } from "../data/todos";
import TodoList from "../components/TodoList";
import { hideComplitedReducer, setTodosReducer } from "../redux/todosSlices";

function Home() {
  const todos = useSelector((state) => state.todos.todos);

  const [isHidden, setIsHidden] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem("@Todos");

        if (todos !== null) {
          dispatch(setTodosReducer(JSON.parse(todos)));
        }
      } catch (e) {
        console.log(e);
      }
    };
    getTodos();
  }, []);

  const handleHidePress = async () => {
    if (isHidden) {
      setIsHidden(false);
      const todos = await AsyncStorage.getItem("@Todos");

      if (todos !== null) {
        dispatch(setTodosReducer(JSON.parse(todos)));
      }
      return;
    }
    setIsHidden(true);
    dispatch(hideComplitedReducer());
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/myrtus_communis.jpg")}
        style={styles.pic}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.title}>Today</Text>
        <TouchableOpacity onPress={handleHidePress}>
          <Text style={{ color: "#3478f6" }}>
            {isHidden ? "Show Completed" : "Hide Completed"}
          </Text>
        </TouchableOpacity>
      </View>
      <TodoList todosData={todos.filter((todo) => todo.isToday)} />

      <Text style={styles.title}>Tomorroy</Text>
      <TodoList todosData={todos.filter((todo) => !todo.isToday)} />
      <TouchableOpacity
        onPress={() => navigation.navigate("Add")}
        style={styles.button}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    paddingHorizontal: 15,
  },
  pic: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignSelf: "flex-end",
  },
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 35,
    marginTop: 10,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 50,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  plus: {
    fontSize: 40,
    color: "#fff",
    position: "absolute",
    top: -6,
    left: 9,
  },
});

export default Home;
