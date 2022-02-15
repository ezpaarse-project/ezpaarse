<template>
  <div v-if="loading" class="loading-page">
    <div class="loading" />
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true;
    },
    finish () {
      this.loading = false;
    }
  }
};
</script>
<style scoped>
  .loading-page {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 1000;
    padding: 1rem;
    text-align: center;
    font-size: 3rem;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .loading {
    display: inline-block;
    width: 2.0rem;
    height: 2.0rem;
    border: 4px solid rgba(9, 133, 81, 0.705);
    border-radius: 50%;
    border-top-color: #158876;
    animation: spin 1s ease-in-out infinite;
  }
  @keyframes spin {
    to {
      -webkit-transform: rotate(720deg);
    }
  }
</style>
