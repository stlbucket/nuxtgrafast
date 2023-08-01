export default defineEventHandler((event) => {
  return `${JSON.stringify(event.context.user)}`
})