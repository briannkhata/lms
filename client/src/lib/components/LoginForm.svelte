<script lang="ts">
  import { goto } from "$app/navigation";
  import { jwtDecode } from "jwt-decode";
  import { pushToast } from "$lib/utils/pushToast";
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let loading = false;
  export let form: HTMLFormElement;
  let username = "";
  let rememberMe = false;
  let firstInput: HTMLInputElement;

  interface DecodedToken {
    role?: string;
  }

  export let showLoginModal: boolean;

  const closeLoginModal = () => {
    showLoginModal = false;
  };

  const handleSubmit = () => {
    loading = true;

    return ({ result }) => {
      form.reset();

      if (result.type === "failure") {
        const { errors, message } = result.data;
        if (errors) {
          Object.values(errors).forEach(
            (val) => val && pushToast(val.toString())
          );
        } else {
          pushToast(message || "Something went wrong.");
        }
        loading = false;
        return;
      }

      const { success, token, message } = result.data;
      pushToast(message || "Login successful!", true);

      if (success && token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          if (rememberMe && username) {
            localStorage.setItem("rememberedUsername", username);
          } else {
            localStorage.removeItem("rememberedUsername");
          }

          closeLoginModal();

          if (decoded?.role === "admin") goto("/admin");
          else if (decoded?.role === "student") goto("/student");
          else pushToast("Unknown user role. Contact support.");
        } catch {
          pushToast("Invalid token payload.");
        }
      }

      loading = false;
    };
  };

  onMount(() => {
    if (showLoginModal && firstInput) firstInput.focus();
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
      username = savedUsername;

      rememberMe = true;
    }
  });
</script>

{#if showLoginModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
  >
    <div class="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-xl">
      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        on:click={closeLoginModal}
        aria-label="Close"
      >
        ✕
      </button>

      <!-- Header -->
      <div class="text-center select-none mb-6">
        <p class="text-lg font-semibold text-blue-800 mb-2">Login</p>
        <h2
          class="text-3xl font-extrabold text-blue-800 leading-tight tracking-wide drop-shadow-sm inline-flex items-center justify-center"
        >
          Foxuls<span class="align-super text-sm ml-1 text-blue-500"
            >&trade;</span
          >
        </h2>
        <p
          class="text-xs text-gray-500 tracking-widest uppercase font-semibold mt-1"
        >
          Academy
        </p>
      </div>

      <!-- Form -->
      <form
        method="POST"
        action="/login"
        use:enhance={handleSubmit}
        bind:this={form}
        class="space-y-4"
      >
        <fieldset disabled={loading} class="space-y-5">
          <!-- Username -->
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-blue-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              class="w-full border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-blue-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              class="w-full border border-blue-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <!-- Remember Me -->
            <div class="flex items-center gap-2 mt-3 mb-3">
              <input
                id="rememberMe"
                type="checkbox"
                bind:checked={rememberMe}
                class="accent-blue-600"
              />
              <label for="rememberMe" class="text-sm text-gray-700 select-none">
                Remember Me
              </label>
            </div>

            <!-- Submit Button -->
            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {#if loading}
                Logging in...
              {:else}
                <i class="fa-solid fa-right-to-bracket"></i>
                Log In
              {/if}
            </button>

            <!-- Forgot Password Link -->
            <p class="text-center text-sm text-gray-500 mt-4">
              <a
                href="/forgot-password"
                class="text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Forgot Password?
              </a>
            </p>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
{/if}
