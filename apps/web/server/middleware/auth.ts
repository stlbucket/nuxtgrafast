export default defineEventHandler((event) => {
  // @ts-ignore
  event.context.user = { tacos: 'yummy' }
})
