<template>
  <div class="not-found-container">
    <h1>404</h1>
    <h1>Page not found</h1>
<!--    <p>Oops! The requested URL was not found on this server.</p>-->
    <router-link to="/">Go to Home Page</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  component: 'NotFoundComponent',
  data() {
    return {};
  }
}
</script>

<style scoped>
.not-found-container {
  text-align: center;
  margin-top: 50px;
}
h1 {
  font-size: 48px;
  margin-bottom: 0;
}
p {
  font-size: 24px;
}
router-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 20px;
  color: #fff;
  background-color: #409EFF;
  border-radius: 4px;
  padding: 10px 20px;
  text-decoration: none;
}
router-link:hover {
  background-color: #66b1ff;
}
</style>