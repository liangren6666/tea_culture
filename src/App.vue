<template>
  <div class="app">
    <!-- ====== NAVBAR ====== -->
    <nav class="navbar" :class="{ scrolled: navScrolled, 'nav-dark': isDarkNav }">
      <router-link to="/" class="brand">茶 · Tea Archive</router-link>
      <ul class="nav-links">
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/compare">茶叶对比</router-link></li>
        <li><router-link to="/origins">产地故事</router-link></li>
        <li><router-link to="/innovation">创新茶饮</router-link></li>
      </ul>
    </nav>

    <!-- ====== PAGE VIEW ====== -->
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- ====== FOOTER ====== -->
    <footer class="site-footer">
      <div class="footer-brand">茶 · Tea Archive</div>
      <p>中国茶叶可视化数据档案 — Vue 3 · ECharts · Element Plus</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const navScrolled = ref(false);
const isDarkNav = computed(() => route.path === "/" && !navScrolled.value);

function handleScroll() {
  navScrolled.value = window.scrollY > 80;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
