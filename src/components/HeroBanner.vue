<template>
  <header class="landing-hero">
    <div class="hero-bg">
      <div class="hero-gradient"></div>
      <div class="hero-grid" aria-hidden="true"></div>
    </div>
    <div class="hero-container container">
      <div class="hero-badge" aria-hidden="true">
        Agile estimation · No sign-up required
      </div>
      <div
        class="d-flex justify-content-center hero-svg-wrap"
        v-html="heroSvg"
      ></div>
      <h1 class="hero-title">
        Estimate together.<br />
        <span class="hero-title-accent">Ship with confidence.</span>
      </h1>
      <p class="hero-subtitle">
        Planning Poker Minimal helps teams agree on complexity in real time—with
        a shared deck, instant reveal, and one link to share.
      </p>
      <div class="hero-actions">
        <router-link class="btn-hero btn-hero--primary" to="/new-game">
          Start a game
        </router-link>
        <a class="btn-hero btn-hero--secondary" href="#how-it-works">
          How it works
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { HERO } from "@/assets/graphics/hero";

const heroSvg = ref(HERO);
</script>

<style lang="scss" scoped>
.landing-hero {
  position: relative;
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem 4rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
      ellipse 100% 80% at 50% -20%,
      rgba(25, 135, 84, 0.25),
      transparent 50%
    ),
    radial-gradient(
      ellipse 80% 50% at 80% 50%,
      rgba(32, 201, 151, 0.12),
      transparent 45%
    ),
    linear-gradient(180deg, #f0f7f4 0%, #e8f5ee 40%, #f8faf9 100%);
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(25, 135, 84, 0.03) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(25, 135, 84, 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}

.hero-container {
  position: relative;
  z-index: 1;
  max-width: 880px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #0f5132;
  background: rgba(25, 135, 84, 0.12);
  padding: 0.4rem 0.9rem;
  border-radius: 100px;
  margin-bottom: 1.5rem;
}

.hero-svg-wrap {
  min-height: 280px;
  margin-bottom: 0.5rem;
  :deep(svg) {
    max-width: 640px;
    width: 100%;
    height: auto;
  }
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #1a1a1a;
  margin: 0 0 1rem;

  .hero-title-accent {
    color: #0f5132;
  }
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.6;
  color: #4a5568;
  max-width: 480px;
  margin: 0 auto 2rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
}

.btn-hero {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &--primary {
    background: #0f5132;
    color: #fff;
    box-shadow: 0 2px 8px rgba(15, 81, 50, 0.3);

    &:hover {
      background: #0d4629;
      box-shadow: 0 4px 16px rgba(15, 81, 50, 0.35);
      color: #fff;
    }
  }

  &--secondary {
    background: #fff;
    color: #0f5132;
    border: 2px solid rgba(15, 81, 50, 0.25);

    &:hover {
      background: rgba(15, 81, 50, 0.06);
      border-color: #0f5132;
      color: #0f5132;
    }
  }
}
</style>
