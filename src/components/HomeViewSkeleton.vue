<template>
  <div class="home-skeleton" aria-busy="true" aria-label="Loading content">
    <!-- Hero -->
    <div class="skeleton-hero">
      <div class="skeleton-badge"></div>
      <div class="skeleton-hero-visual"></div>
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-title short"></div>
      <div class="skeleton-line skeleton-subtitle"></div>
      <div class="skeleton-actions">
        <div class="skeleton-cta"></div>
        <div class="skeleton-cta secondary"></div>
      </div>
    </div>
    <!-- About -->
    <section class="skeleton-section">
      <div class="skeleton-about-grid">
        <div class="skeleton-icon-xl"></div>
        <div class="skeleton-about-content">
          <div class="skeleton-label"></div>
          <div class="skeleton-line skeleton-heading"></div>
          <div class="skeleton-text">
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      </div>
    </section>
    <!-- How it works -->
    <section class="skeleton-section skeleton-section--alt">
      <div class="skeleton-label center"></div>
      <div class="skeleton-line skeleton-heading center w-50"></div>
      <div class="skeleton-steps">
        <div v-for="i in 4" :key="i" class="skeleton-step-card"></div>
      </div>
    </section>
    <!-- Features -->
    <section class="skeleton-section">
      <div class="skeleton-label center"></div>
      <div class="skeleton-line skeleton-heading center w-40"></div>
      <div class="skeleton-features-grid">
        <div
          v-for="i in 5"
          :key="i"
          class="skeleton-feature-card"
          :class="{ wide: i === 5 }"
        ></div>
      </div>
    </section>
    <!-- Stats -->
    <section class="skeleton-section skeleton-section--dark">
      <div class="skeleton-stats">
        <div v-for="i in 3" :key="i" class="skeleton-stat"></div>
      </div>
    </section>
    <!-- CTA -->
    <section class="skeleton-section skeleton-section--cta">
      <div class="skeleton-line skeleton-heading center w-40"></div>
      <div class="skeleton-line short center"></div>
      <div class="skeleton-cta center"></div>
    </section>
  </div>
</template>

<script lang="ts" setup>
// Skeleton for redesigned HomeView layout
</script>

<style lang="scss" scoped>
.home-skeleton {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: #f8faf9;
  pointer-events: none;
}

.skeleton-section {
  padding: 3rem 1rem;
  &--alt {
    background: #f0f7f4;
  }
  &--dark {
    background: rgba(15, 81, 50, 0.15);
    padding: 2rem 1rem;
  }
  &--cta {
    background: #e8f5ee;
  }
}

.skeleton-hero {
  padding: 3rem 1rem 4rem;
  text-align: center;
  max-width: 880px;
  margin: 0 auto;
}

.skeleton-badge {
  width: 180px;
  height: 28px;
  margin: 0 auto 1.5rem;
  border-radius: 100px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.12) 50%,
    rgba(0, 0, 0, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-hero-visual {
  width: 100%;
  max-width: 640px;
  height: 280px;
  margin: 0 auto 1rem;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.12) 50%,
    rgba(0, 0, 0, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-title {
  max-width: 320px;
  height: 36px;
  margin: 0 auto 0.5rem;
  &.short {
    max-width: 240px;
    height: 36px;
    margin-bottom: 1rem;
  }
}

.skeleton-subtitle {
  max-width: 400px;
  height: 20px;
  margin: 0 auto 2rem;
}

.skeleton-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.skeleton-cta {
  width: 140px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.08) 25%,
    rgba(0, 0, 0, 0.14) 50%,
    rgba(0, 0, 0, 0.08) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  &.secondary {
    width: 120px;
  }
  &.center {
    margin: 0 auto;
  }
}

.skeleton-about-grid {
  display: grid;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
}

.skeleton-icon-xl {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.12) 50%,
    rgba(0, 0, 0, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-about-content {
  .skeleton-label {
    width: 60px;
    height: 14px;
    margin-bottom: 0.5rem;
  }
}

.skeleton-label {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.12) 50%,
    rgba(0, 0, 0, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  &.center {
    margin: 0 auto 0.5rem;
  }
  &.center + .skeleton-heading.center {
    margin-top: 0;
  }
}

.skeleton-line {
  height: 1rem;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.06) 25%,
    rgba(0, 0, 0, 0.12) 50%,
    rgba(0, 0, 0, 0.06) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;

  &.skeleton-heading {
    height: 24px;
    margin-bottom: 1rem;
    &.center {
      margin-left: auto;
      margin-right: auto;
    }
  }

  &.short {
    width: 70%;
  }
  &.center {
    margin-left: auto;
    margin-right: auto;
  }
}

.skeleton-text .skeleton-line + .skeleton-line {
  margin-top: 0.5rem;
}

.w-50 {
  width: 50%;
}
.w-40 {
  width: 40%;
}

.skeleton-steps {
  display: grid;
  gap: 1rem;
  max-width: 960px;
  margin: 2rem auto 0;
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.skeleton-step-card {
  height: 140px;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.05) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-features-grid {
  display: grid;
  gap: 1rem;
  max-width: 1100px;
  margin: 2rem auto 0;
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
    .skeleton-feature-card.wide {
      grid-column: span 2;
    }
  }
}

.skeleton-feature-card {
  height: 200px;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.04) 25%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

.skeleton-stats {
  display: grid;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
  @media (min-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
    text-align: center;
  }
}

.skeleton-stat {
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.3) 25%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.3) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
