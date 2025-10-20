<script setup>
import Logo from './assets/MPlogo.png'
</script>

<template>
  
  <div id="HeaderContainer">
    <div id="TopLeftProject">
      <img :src=Logo alt="MealPlanner Logo" id="BarLogo"/>
      <h1>Meal Planner</h1>
    </div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/meals">Meals</router-link>
    </nav>
  </div>
  <router-view/>
</template>