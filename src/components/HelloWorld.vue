<template>
  <div class="hello">
    <h1>{{ string }}</h1>
    <button @click="fetchData()">{{ firstButton }}</button>

    <div id="center">
      <table id="center">
        <tr v-for="(row, idx) in into" :key="idx">
          <td>{{ row.id }}</td>
          <td>{{ row.firstName }}</td>
          <td>{{ row.lastName }}</td>
          <td>
            <button @click="Edit(row.id)">Edit</button>
          </td>
          <td>
            <button @click="Delete(row.id, idx)">Delete</button>
          </td>
        </tr>
      </table>
      <table id="center second">
        <tr v-for="(row, idx) in edit" :key="idx">
          <td><input type="text" id="name" name="name" :placeholder="row.firstName"></td>
          <td><input type="text" id="surname" name="surname" :placeholder="row.lastName"></td>
          <td><input type="text" id="email" name="email" :placeholder="row.email"></td>
          <td>
            <button v-if="save" @click="Update(row)">Сохранить</button>
          </td>
        </tr>
      </table>

      <button v-if="addButtonIsHidden" @click="AddStudent">Добавить студента</button>
      <button v-if="sendAddBtn" @click="SaveNewStudent">Добавить</button>
    </div>
  </div>
</template>

<script>

//todo полное нарушение single responsibility !!! как разберусь разделю по отдельным компонентам 
import axios from 'axios';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: function () {
    return {
      firstButton: "Получить список студентов",
      addButtonIsHidden: false,
      sendAddBtn: false,
      save: true,
      into: null,
      edit: null,
      string: "Начальная страница"
    }
  },
  methods: {
    fetchData() {
      this.configureButtonsAndMsg(true, "Получить список студентов");
      this.sendAddBtn = false;
      this.string = "Все студенты";
      this.edit = null;
      try {
        axios.get('/student').then((response) => {
          this.into = JSON.parse(JSON.stringify(response.data));
        })
      } catch (err) {
        console.error(err);
      }
    },
    Delete(id, idx) {
      this.configureButtonsAndMsg(false, "Все студенты")
      axios.delete('/student/' + id);
      var g = [];
      for (var i = idx + 1; i < this.into.length; i++) {
        g.push(this.into[i]);
      }
      this.into = g;
      console.log(this.into);
    },
    Edit(id) {
      this.configureButtonsAndMsg(false, "На главную страницу");
      var temp = [];
      axios.get('/student/' + id)
          .then((responce) => {
            temp.push(responce.data);
            this.into = null;
            this.edit = temp;
            this.string = 'Изенение пользователя';
          });
    },
    Update(row) {
      this.configureButtonsAndMsg(false, "На главную страницу");
      var obj = {};
      obj.id = row.id;
      obj.firstName = this.ifEmptyOrElse( document.getElementById('name').value, row.firstName)
      obj.lastName = this.ifEmptyOrElse(document.getElementById('surname').value, row.lastName)
      obj.email = this.ifEmptyOrElse(document.getElementById('email').value, row.email)
      axios.put('/student', obj).then(response => {
        this.resolve(response.data)
      });
      this.fetchData();
    },
    AddStudent() {
      this.configureButtonsAndMsg(false, "На главную страницу");
      this.save = false;
      this.edit = null;
      console.log(this.edit);
      this.into = null;
      var temp = [{
        firstName: "Name",
        lastName: "Surname",
        email: "Email"
      }];
      this.edit = temp;
      console.log(this.edit);
      this.sendAddBtn = true;
    },
    SaveNewStudent() {
      this.save = true;
      var obj = {};
      this.sendAddBtn = false;
      obj.firstName = document.getElementById('name').value;
      obj.lastName = document.getElementById('surname').value;
      obj.email = document.getElementById('email').value;
      axios.post('/student', obj);
      this.fetchData();
    },
    configureButtonsAndMsg(addButton, msg) {
      this.addButtonIsHidden = addButton;
      this.firstButton = msg;
    },
    ifEmptyOrElse(srt, defaultVal){
      if(srt === ""){
        return defaultVal;
      }
      return srt;
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

#center {
  margin: auto;
  width: 50%;
  padding: 10px;
}

table, th, td {
  padding: 20px;
}

td {
  font-size: 20px;
  color: black;
  font-weight: bold;
}
</style>
