<template>
  <div v-for="q in allQuotes">{{ q.content }}</div>
</template>

<script lang="ts" setup>
  const allQuotes: Ref<any[]> = ref([])
  const loadData = async () => {
    const result = await GqlAllQuotes()
    allQuotes.value = result.allQuotes.nodes
  }
  loadData()
</script>
