// Used for pages which are only visible for unauthenticated users like: login page
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { status } = useAuth();
  console.log("MIDDLEWARE: redirect if authenticated:", status.value);

  if (status.value === "authenticated") {
    return navigateTo({ name: "index" });
  }
});
