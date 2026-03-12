<script setup>
</script>

<template>
  <router-view />
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  background-color: #F5F1EA; /* Warm beige base */
  color: #3E2723; /* Dark Wood text color */
}

/* Global TCM Heading Font */
h1, h2, h3, h4, h5, h6 {
  font-family: "Kaiti SC", "STKaiti", "KaiTi", "Songti SC", "SimSun", serif;
  font-weight: bold;
}

#app {
  height: 100%;
}

/* Overriding Element Plus generic primary color to match TCM red/brown */
:root {
  --el-color-primary: #884A39;
  --el-color-primary-light-3: #A65D4B;
  --el-color-primary-light-5: #C47F6D;
  --el-color-primary-light-7: #E2A18F;
  --el-color-primary-light-8: #F0B2A1;
  --el-color-primary-light-9: #FDE2DA;
  --el-color-primary-dark-2: #6B3A2C;
}
</style>
