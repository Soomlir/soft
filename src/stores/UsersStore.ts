import { defineStore } from "pinia";
import { ref, watch } from "vue";
import type { Ref } from 'vue';

interface User {
  id: number;
  mark: { text: string }[];
  type: string;
  login: string;
  password: string;
  showPassword: boolean;
}


export const useUsersStore = defineStore("usersStore", () => {
  const usersList = ref([]) as Ref<User[]>;

  const addUser = (newUser: any) => {
    usersList.value.push(newUser);
  };

  const removeUser = (index: number) => {
    usersList.value = usersList.value.filter((item: User) => item.id != index);
  };

  const loadUsersFromLocalStorage = () => {
    const storedUsers = localStorage.getItem("usersList7");
    console.log("Загрузка из localStorage:", storedUsers);
    if (storedUsers) {
      usersList.value = JSON.parse(storedUsers);
    } else {
      usersList.value = [
        {
          id: 1,
          mark: [{text: 'text1'}],
          type: "local",
          login: "admin",
          password: "123123",
          showPassword: false,
        },
        {
          id: 2,
          mark: [{text: 'text'}, {text: 'text'}],
          type: "ldap",
          login: "user",
          password: "777",
          showPassword: false,
        },
      ];
      saveUsersToLocalStorage();
    }
  };

  const saveUsersToLocalStorage = () => {
    try {
      localStorage.setItem("usersList7", JSON.stringify(usersList.value));
      console.log("Данные успешно сохранены в localStorage");
    } catch (error) {
      console.error("Ошибка при сохранении в localStorage:", error);
    }
  };

  const updateUserMark = (id: number, mark: Array<{ text: string }>) => {
    const user = usersList.value.find((user: User) => user.id === id);
    if (user) {
      user.mark = mark;
    }
  };

  loadUsersFromLocalStorage();
  watch(usersList, saveUsersToLocalStorage);

  return { usersList, addUser, removeUser, updateUserMark };
});
