import { ofetch } from 'ofetch'

export const $api = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL || '/productos',
  async onRequest({ options }) {
    const accessToken = useCookie('accessToken').value
    if (accessToken)
      options.headers.append('Authorization', `Bearer ${accessToken}`)
  },
})

export async function getProducts() {
  try {
    const response = await $api('/productos')
    return response
  } catch (error) {
    console.error('Error fetching productos:', error)
    throw error
  }
}

export async function getCategories() {
  try {
    const response = await $api('/categorias')
    return response
  } catch (error) {
    console.error('Error fetching productos:', error)
    throw error
  }
}
