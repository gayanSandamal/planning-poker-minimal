<template>
  <HeroBanner />
  <section id="about" class="py-5">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <IconWidget icon="APPS" size="xl" />
        </div>
        <div class="col-md-6">
          <div class="section-header">
            <h2 class="section-title">About</h2>
            <div class="section-divider"></div>
          </div>
          <p class="section-description">
            The Planning Poker App is a powerful tool designed to revolutionize
            the way teams estimate the complexity of their tasks. With a
            user-friendly interface and the proven Planning Poker methodology,
            this app allows teams to efficiently and accurately estimate the
            effort required for each task.
          </p>
        </div>
      </div>
    </div>
  </section>

  <div class="container-fluid bg-success bg-opacity-25 py-5">
    <section id="features" class="py-5">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Features</h2>
          <div class="section-divider"></div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="feature-card">
              <i class="bi bi-calendar-check"></i>
              <h3 class="sub-section-title">Efficient Task Estimation</h3>
              <IconWidget icon="EFFICIENT" class="my-4" />
              <p class="section-description">
                Utilize the Planning Poker methodology to estimate task
                complexity accurately.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card">
              <i class="bi bi-layout-text-window-reverse"></i>
              <h3 class="sub-section-title">User-Friendly Interface</h3>
              <IconWidget icon="DOG" class="my-4" />
              <p class="section-description">
                Enjoy a clean and intuitive user interface for easy navigation
                and interaction.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card">
              <i class="bi bi-chat-dots"></i>
              <h3 class="sub-section-title">Real-Time Collaboration</h3>
              <IconWidget icon="REALTIME" class="my-4" />
              <p class="section-description">
                Collaborate with your team members in real-time for efficient
                task estimation.
              </p>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="feature-card">
              <i class="bi bi-card-checklist"></i>
              <h3 class="sub-section-title">Flexible Card Deck</h3>
              <IconWidget icon="CARDS" class="my-4" />
              <p class="section-description">
                Customize your card deck to match your team's preferences and
                estimation needs.
              </p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="feature-card">
              <i class="bi bi-shield-check"></i>
              <h3 class="sub-section-title">Secure and Reliable</h3>
              <IconWidget icon="RELEABLE" class="my-4" />
              <p class="section-description">
                Rest assured that your data is safe and your app experience is
                reliable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import HeroBanner from "@/components/HeroBanner.vue";
import IconWidget from "@/components/IconWidget.vue";
</script>
