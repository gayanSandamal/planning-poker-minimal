<template>
  <div class="container-fluid bg-success bg-opacity-50 py-5">
    <section class="hero">
      <div class="container">
        <div class="d-flex justify-content-center" v-html="HERO"></div>
        <h1 class="hero-title">Planning Poker Minimal</h1>
        <p class="hero-subtitle">Efficiently estimate your project with ease</p>
        <router-link class="btn btn-lg btn-success" to="/new-game"
          >Start Playing Now</router-link
        >
      </div>
    </section>
  </div>
</template>

<script setup>
import { HERO } from "@/assets/graphics/SVGs.ts";
</script>

<style lang="scss" scoped>
/* Custom SCSS styles */
.hero {
  // background-image: url("path/to/your-image.jpg");
  background-size: cover;
  background-position: center;
  text-align: center;
  color: #fff;

  .container {
    max-width: 900px;
    margin: 0 auto;
  }

  .hero-title {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .hero-subtitle {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .btn {
    font-size: 18px;
    padding: 12px 24px;
    border-radius: 30px;
  }
}
</style>
