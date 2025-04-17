export default defineNuxtPlugin(nuxtApp => {
        if (process.client) {
        const csrfTokenMeta = document.querySelector('meta[name="csrf-token"]');

        if (csrfTokenMeta) {
            const csrfToken = csrfTokenMeta.getAttribute('content');

            if (csrfToken) {
                nuxtApp.provide('csrfToken', csrfToken);
            }
        } else {
            console.warn('CSRF токен не знайдений у мета-тезі.');
        }
    }
});
