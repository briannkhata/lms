<script lang="ts">
  import { pushToast } from "$lib/utils/pushToast";
  import { enhance } from "$app/forms";

  export let showRegisterModal = false;

  export let form: HTMLFormElement;
  let showPassword = false;
  let loading = false;
  export let gradelevels: Array<{ id: number; name: string }> = [];

  function closeModal() {
    showRegisterModal = false;
  }

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  function handleSubmit() {
    loading = true;

    return ({ result }) => {
      console.log("Form submit result:", result);

      const { type, data } = result;

      if (type === "failure") {
        console.log("Failure case:", data);
        if (data?.errors && Object.keys(data.errors).length > 0) {
          Object.values(data.errors).forEach((value) => {
            console.log("Pushing toast for error:", value);
            if (value) pushToast(value.toString());
          });
        } else if (data?.message) {
          console.log("Pushing toast for message:", data.message);
          pushToast(data.message);
        } else {
          console.log("Pushing toast for generic error");
          pushToast("Something went wrong.");
        }
        loading = false;
        // Don't close modal on failure
        return;
      }

      // Success case
      console.log("Success case:", data);
      form.reset();
      //selectedGradeLevel = "";
      pushToast(data?.message ?? "Registration successful!", true);
      loading = false;
      closeModal();
    };
  }
</script>

{#if showRegisterModal}
  <!-- Modal Container -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md relative shadow-2xl overflow-y-auto max-h-[90vh] space-y-6"
    >
      <button
        class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
        onclick={closeModal}
        aria-label="Close"
      >
        ✕
      </button>
      <!-- Header -->
      <!-- Header -->
      <div class="text-center select-none mb-6">
        <p class="text-lg font-semibold text-blue-800 mb-2">Create Account</p>
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
        action="/register"
        use:enhance={handleSubmit}
        bind:this={form}
        class="space-y-5"
      >
        <fieldset disabled={loading} class="space-y-5">
          <!-- Full Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-blue-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="fullname"
              type="text"
              class="w-full border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
              placeholder="Username"
              type="text"
              class="w-full border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Password -->
          <div class="relative">
            <label
              for="password"
              class="block text-sm font-medium text-blue-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              class="w-full border border-blue-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              class="absolute top-[38px] right-3 text-blue-700 hover:text-blue-900 focus:outline-none"
              onclick={togglePasswordVisibility}
              tabindex="-1"
            >
              {#if showPassword}
                👁️
              {:else}
                👁️‍🗨️
              {/if}
            </button>
          </div>

          <!-- Grade Level -->
          <div>
            <label
              for="class"
              class="block text-sm font-medium text-blue-700 mb-2"
            >
              Class
            </label>
            <select
              id="class"
              name="grade_level_id"
              class="w-full border border-blue-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled selected>Select your class</option>
              {#each gradelevels as grade}
                <option value={grade.id}>{grade.name}</option>
              {/each}
            </select>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 flex justify-center items-center gap-2"
            disabled={loading}
          >
            {#if loading}
              <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  stroke-width="4"
                  fill="none"
                  stroke-dasharray="60"
                />
              </svg>
              Processing...
            {:else}
              <i class="fa-solid fa-right-to-bracket"></i>
              Register
            {/if}
          </button>
        </fieldset>
      </form>
    </div>
  </div>
{/if}
