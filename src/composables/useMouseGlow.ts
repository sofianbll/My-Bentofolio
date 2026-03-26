import { onMounted, onUnmounted, type Ref } from 'vue'

export function useMouseGlow(containerRef: Ref<HTMLElement | null>) {
  function handleMove(e: MouseEvent) {
    const container = containerRef.value
    if (!container) return

    const cards = container.querySelectorAll<HTMLElement>('.bento-glow')
    for (const card of cards) {
      const rect = card.getBoundingClientRect()
      card.style.setProperty('--x', `${e.clientX - rect.left}px`)
      card.style.setProperty('--y', `${e.clientY - rect.top}px`)
    }
  }

  onMounted(() => {
    containerRef.value?.addEventListener('mousemove', handleMove)
  })

  onUnmounted(() => {
    containerRef.value?.removeEventListener('mousemove', handleMove)
  })
}
