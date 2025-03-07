<script setup lang="ts">
import { useUsersStore } from "./stores/UsersStore.ts";

interface User {
  id: number;
  mark: { text: string }[];
  type: string;
  login: string | null;
  password: string | null;
  showPassword: boolean;
  isError?: boolean; 
}

const usersStore = useUsersStore();

const toggleShowPassword = (index: number) => {
  usersStore.usersList[index].showPassword =
    !usersStore.usersList[index].showPassword;
};

const addNewUser = () => {
  usersStore.addUser({
    id: Date.now(),
    mark: [{ text: "" }],
    type: "local",
    login: "",
    password: "",
    showPassword: false,
    isError: false,
  });
};

const deleteUser = (id: number) => {
  usersStore.removeUser(id);
};

const isLoginError = (login: string | null) => {
  return !login || login.length < 4;
};

const isPasswordError = (password: string | null) => {
  return !password || password.length < 4;
};

const updateField = (index: number, field: any, value: string) => {
  usersStore.usersList[index][field] = value;
  console.log(usersStore.usersList[index][field]);
  localStorage.setItem("usersList7", JSON.stringify(usersStore.usersList));
};

const updateType = (index: number, value: string) => {
  usersStore.usersList[index]["type"] = value;
  if (usersStore.usersList[index]["type"] == "ldap") {
    usersStore.usersList[index]["password"] = null;
  }
  localStorage.setItem("usersList7", JSON.stringify(usersStore.usersList));
};

const getFormattedMark = (user: User) => {
  return user.mark.map((item) => item.text).join("; ");
};

const updateMark = (user: User, value: string) => {
  const newMark = value.split(";").map((text) => ({ text: text.trim() }));

  usersStore.updateUserMark(user.id, newMark);
  localStorage.setItem("usersList7", JSON.stringify(usersStore.usersList));
};
</script>

<template>
  <section>
    <h1>Управление учетными записями</h1>
    <p>Учетные записи <button @click="addNewUser">+</button></p>
    <p>
      Для указания нескольких меток для одной пары логин/пароль используйте
      разделитель ;
    </p>
    <table>
      <thead>
        <tr>
          <th>Метки</th>
          <th>Тип записи</th>
          <th>Логин</th>
          <th>Пароль</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in usersStore.usersList" :key="user.id">
          <td>
            <input
              :value="getFormattedMark(user)"
              @input="(e) => updateMark(user, (e.target as HTMLInputElement).value || '')"
              placeholder="Метка"
            />
          </td>
          <td>
            <select v-model="user.type" @change="updateType(index, user.type)">
              <option value="local">Локальная</option>
              <option value="ldap">LDAP</option>
            </select>
          </td>
          <td>
            <input
              type="text"
              v-model="user.login"
              placeholder="Login"
              @blur="updateField(index, 'login', user.login)"
              maxlength="100"
              :class="{ 'error-field': isLoginError(user.login) }"
            />
          </td>
          <td v-if="user.type == 'local'">
            <input
              :type="user.showPassword ? 'text' : 'password'"
              v-model="user.password"
              placeholder="Password"
              @blur="updateField(index, 'password', user.password)"
              maxlength="100"
              :class="{ 'error-field': isPasswordError(user.password) }"
            />
            <button type="button" @click="toggleShowPassword(index)">sh</button>
          </td>
          <td>
            <button @click="deleteUser(user.id)">del</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<style scoped>
th {
  text-align: left;
}

input {
  border: 2px solid black;
}

.error-field {
  border-color: red;
}
</style>
