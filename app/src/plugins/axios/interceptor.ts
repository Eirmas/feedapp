supabase.auth.onAuthStateChange(event => {
  if (event === 'SIGNED_IN') {
    authStore.loadSession();
    authStore.loadRedirectRoute();
  } else if (event === 'SIGNED_OUT') {
    authStore.clearSession();
  }
});