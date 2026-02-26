<template>
  <div class="about-page">
    <div class="about-page-bg" aria-hidden="true"></div>

    <header class="about-hero" aria-labelledby="about-heading">
      <div class="about-hero-inner">
        <span class="about-hero-label">About</span>
        <h1 id="about-heading" class="about-hero-title">
          Built for teams that estimate
        </h1>
        <p class="about-hero-lead">
          A minimal, no-sign-up planning poker app—designed and developed by
          Gayan Sandamal to help teams align on complexity and ship with
          confidence.
        </p>
      </div>
    </header>

    <main class="about-main">
      <div class="about-content">
        <article class="about-card about-card--app">
          <span class="about-card-label">
            <i class="bi bi-app" aria-hidden="true"></i>
            The app
          </span>
          <h2 class="about-card-title">What it is</h2>
          <p class="about-card-text">
            Planning Poker Minimal brings the classic estimation game online—so
            your team can align on complexity without the fuss. With a
            user-friendly interface and the proven Planning Poker methodology,
            teams can efficiently and accurately estimate the effort required
            for each task.
          </p>
          <p class="about-card-text">
            Team members collaborate in real time, and everyone's input is
            considered. Choose a customizable card deck—Fibonacci, T-shirt
            sizes, or custom scales—to match your team's approach.
          </p>
        </article>

        <article class="about-card about-card--secure">
          <span class="about-card-label">
            <i class="bi bi-shield-check" aria-hidden="true"></i>
            Secure & simple
          </span>
          <h2 class="about-card-title">No sign-up, no friction</h2>
          <p class="about-card-text">
            The app ensures data security and reliability. No account or sign-up
            is required—just share the game link and start estimating. With a
            sleek, intuitive design, it simplifies the process, saves time, and
            helps teams make informed decisions based on accurate estimations.
          </p>
        </article>

        <article class="about-card about-card--creator">
          <span class="about-card-label">
            <i class="bi bi-person-badge" aria-hidden="true"></i>
            Creator
          </span>
          <h2 class="about-card-title">Gayan Sandamal</h2>
          <div class="about-creator-bio">
            <p class="about-card-text">
              <a
                href="https://lk.linkedin.com/in/gayan-sandamal"
                target="_blank"
                rel="noopener noreferrer"
                class="about-inline-link"
                >Gayan Sandamal</a
              >
              is a passionate Frontend Engineer with nearly a decade of
              experience building scalable web and mobile products with Vue,
              React, TypeScript and Node. He has a strong foundation in UI/UX
              design and specializes in intuitive, user-centric interfaces that
              are both visually appealing and highly functional. From this open
              source planning poker app to
              <a
                href="https://choner.io/"
                target="_blank"
                rel="noopener noreferrer"
                class="about-inline-link"
                >Choner</a
              >
              —helping people build consistency and well-being—he focuses on
              delivery that makes a real impact for users.
            </p>
            <p class="about-connect-label">Connect</p>
            <div class="about-links">
              <a
                href="https://gayansandamal.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                class="about-link about-link--site"
                aria-label="Gayan Sandamal personal website"
              >
                <i class="bi bi-globe" aria-hidden="true"></i>
                <span>Website</span>
              </a>
              <a
                href="https://lk.linkedin.com/in/gayan-sandamal"
                target="_blank"
                rel="noopener noreferrer"
                class="about-link about-link--linkedin"
                aria-label="Gayan Sandamal on LinkedIn"
              >
                <i class="bi bi-linkedin" aria-hidden="true"></i>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/gayanSandamal"
                target="_blank"
                rel="noopener noreferrer"
                class="about-link about-link--github"
                aria-label="Gayan Sandamal on GitHub"
              >
                <i class="bi bi-github" aria-hidden="true"></i>
                <span>GitHub</span>
              </a>
              <a
                href="https://twitter.com/GayanSandamal"
                target="_blank"
                rel="noopener noreferrer"
                class="about-link about-link--twitter"
                aria-label="Gayan Sandamal on Twitter"
              >
                <i class="bi bi-twitter-x" aria-hidden="true"></i>
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </article>

        <div class="about-cta-wrap">
          <router-link to="/new-game" class="about-cta-btn">
            Create a game
          </router-link>
        </div>
      </div>

      <aside class="about-visual" aria-hidden="true">
        <div class="about-visual-inner">
          <IconWidget icon="DEV" size="l" :align="'center'" />
        </div>
      </aside>
    </main>
  </div>
</template>

<script lang="ts" setup>
import IconWidget from "@/components/IconWidget.vue";
</script>

<style lang="scss" scoped>
.about-page {
  position: relative;
  min-height: 100%;
  padding-bottom: 4rem;
}

.about-page-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    160deg,
    #f8faf9 0%,
    #f0f7f4 40%,
    #e8f5ee 70%,
    #f0f7f4 100%
  );
  opacity: 0.97;
}

.about-hero {
  padding: 3rem 1.25rem 2.5rem;
  text-align: center;
}

.about-hero-inner {
  max-width: 640px;
  margin: 0 auto;
}

.about-hero-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0f5132;
  margin-bottom: 0.75rem;
}

.about-hero-title {
  font-size: clamp(1.75rem, 4.5vw, 2.35rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: #1a1a1a;
  margin: 0 0 0.75rem;
  line-height: 1.2;
}

.about-hero-lead {
  font-size: clamp(0.9375rem, 1.8vw, 1.0625rem);
  line-height: 1.65;
  color: #4a5568;
  margin: 0;
}

.about-main {
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem 2rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 320px;
    gap: 3rem;
    align-items: start;
    padding: 0 2rem 3rem;
  }
}

.about-content {
  max-width: 680px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;

  @media (min-width: 992px) {
    margin: 0;
    gap: 2rem;
  }
}

.about-card {
  background: #fff;
  border-radius: 20px;
  padding: 1.75rem 1.5rem;
  border: 1px solid rgba(15, 81, 50, 0.06);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(15, 81, 50, 0.04);
  transition: box-shadow 0.25s ease, border-color 0.25s ease,
    transform 0.25s ease;

  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(15, 81, 50, 0.08);
    border-color: rgba(15, 81, 50, 0.1);
  }
}

.about-card-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f5132;
  margin-bottom: 0.5rem;

  i {
    font-size: 0.9375rem;
    opacity: 0.9;
  }
}

.about-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
  line-height: 1.3;
}

.about-card-text {
  font-size: 1rem;
  line-height: 1.75;
  color: #4a5568;
  margin: 0 0 1rem;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.about-inline-link {
  color: #0f5132;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid rgba(15, 81, 50, 0.35);
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: #198754;
    border-bottom-color: #198754;
  }
}

.about-card--creator {
  padding: 2rem 1.5rem;
  border-color: rgba(15, 81, 50, 0.1);
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(15, 81, 50, 0.06);
}

.about-creator-bio {
  margin-top: 0.25rem;
}

.about-connect-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #0f5132;
  margin: 1.25rem 0 0.75rem;
}

.about-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.about-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  background: #f8faf9;
  border: 1px solid rgba(15, 81, 50, 0.12);
  border-radius: 10px;
  text-decoration: none;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease,
    transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    color: #0f5132;
    background: rgba(15, 81, 50, 0.06);
    border-color: rgba(15, 81, 50, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 81, 50, 0.12);
  }

  i {
    font-size: 1.125rem;
  }
}

.about-link--site:hover {
  color: #0f5132;
  border-color: rgba(15, 81, 50, 0.25);
  box-shadow: 0 4px 12px rgba(15, 81, 50, 0.12);
}

.about-link--linkedin:hover {
  color: #0a66c2;
  border-color: rgba(10, 102, 194, 0.3);
  box-shadow: 0 4px 12px rgba(10, 102, 194, 0.15);
}

.about-link--github:hover {
  color: #1a1a1a;
  border-color: rgba(26, 26, 26, 0.25);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.about-link--twitter:hover {
  color: #000;
  border-color: rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.about-cta-wrap {
  padding-top: 0.5rem;
  text-align: center;

  @media (min-width: 992px) {
    text-align: left;
  }
}

.about-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(145deg, #0f5132 0%, #198754 100%);
  border-radius: 14px;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(15, 81, 50, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(15, 81, 50, 0.4);
  }
}

.about-visual {
  display: flex;
  justify-content: center;
  order: -1;

  @media (min-width: 992px) {
    order: 0;
    position: sticky;
    top: 2rem;
    justify-content: flex-end;
  }
}

.about-visual-inner {
  background: #fff;
  border-radius: 24px;
  padding: 2rem;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(15, 81, 50, 0.06);
  border: 1px solid rgba(15, 81, 50, 0.08);
}
</style>
