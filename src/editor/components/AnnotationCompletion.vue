<script setup lang="ts">
    const show = defineModel<boolean>();
    const emit = defineEmits<{
        ( e: 'next' ): void
        ( e: 'close' ): void
    }>();

    const goNext = () => {
        show.value = false;
        emit( 'next' );
    };

    const close = () => {
        show.value = false;
        emit( 'close' );
    };
</script>

<template>
    <div v-if="show" class="overlay" @click.self="close">
        <div class="overlay-box">
            <div class="content">
                <div class="icon-circle">
                    🎉
                </div>
                <h1>Annotation Complete!</h1>
                <p>You’ve successfully completed this annotation.</p>
            </div>

            <div class="actions">
                <button class="btn-primary" @click="goNext">
                    Go to Next Annotation
                </button>
                <button class="btn-secondary" @click="close">
                    Stay Here
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: var(--theme-overlay, rgba(0, 0, 0, 0.7));
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  z-index: 1000;
  backdrop-filter: blur(4px);

  .overlay-box {
    width: 90%;
    max-width: 450px;
    background-color: var(--theme-bg-2, #fff);
    border-radius: 24px;
    padding: 2.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    text-align: center;
    animation: modalPop 0.3s ease-out;

    .icon-circle {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--theme-foreground-text, #1a1a1a);
      margin: 0 0 0.5rem 0;
    }

    p {
      color: var(--theme-background-text-20, #666);
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      button {
        padding: 0.8rem 1.5rem;
        border-radius: 12px;
        border: none;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.1s, filter 0.2s;

        &:hover {
          filter: brightness(1.1);
        }

        &:active {
          transform: scale(0.98);
        }
      }

      .btn-primary {
        background-color: var(--theme-bg-1, #4f46e5);
        color: white;
      }

      .btn-secondary {
        background-color: transparent;
        color: var(--theme-background-text-20, #666);
        text-decoration: underline;
      }
    }
  }
}

@keyframes modalPop {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
