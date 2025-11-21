<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      To follow the developpment on a receipe planner check the github repository : 
      <a href="https://github.com/YohannP0611/Meal_Planner" target="_blank" rel="noopener">Meal_Planner</a>.
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  text-align: center;
}
h1 {
  font-size: xxx-large;
  margin: 50px;
}
h3 {
  margin: 20px;
}
h3:first-of-type {
  margin-top: 400px;
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
</style>