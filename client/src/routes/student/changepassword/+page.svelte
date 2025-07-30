<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let formElement: HTMLFormElement;
  export let data;
  const { user, userOne } = data;

  let showPassword = false;

  function handleSubmit() {
    return ({ result }) => {
      const { type, data } = result;

      if (type === "failure") {
        if (data?.errors) {
          Object.entries(data.errors).forEach(([key, value]) => {
            if (value) {
              toast.push(`${value}`, {
                theme: {
                  "--toastBackground": "#e53e3e",
                  "--toastBarBackground": "#c53030",
                  "--toastColor": "white",
                },
              });
            }
          });
        } else if (data?.message) {
          toast.push(data?.message, {
            theme: {
              "--toastBackground": "#e53e3e",
              "--toastBarBackground": "#c53030",
              "--toastColor": "white",
            },
          });
        }
        return; // Important: prevent further execution
      }

      if (type === "success") {
        toast.push(data?.message, {
          theme: {
            "--toastBackground": "#38a169",
            "--toastBarBackground": "#2f855a",
            "--toastColor": "white",
          },
        });

        // ✅ Only redirect on success
        setTimeout(() => {
          goto("/");
        }, 1000);
      }
    };
  }
</script>

{#if user}
  <div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-xl mx-auto">
    <div
      class="bg-white border border-gray-200 rounded-md shadow-sm p-6 md:p-8"
    >
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 select-none">
          Change Password
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Fill in the details below to change password.
        </p>
        <hr class="mt-5 border-t border-gray-200" />
      </div>

      <!-- Form -->
      <form
        method="POST"
        use:enhance={handleSubmit}
        bind:this={formElement}
        class="space-y-8"
      >
        <!-- First Row -->

        <div class="relative">
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password <span class="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter a strong password"
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-sm text-sm"
          />
          <input type="text" name="id" value={userOne.id} hidden />
          <button
            type="button"
            class="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onclick={() => (showPassword = !showPassword)}
            tabindex="-1"
          >
            <i class={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            ></i>
          </button>
        </div>

        <!-- Submit -->
        <div class="text-left">
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 rounded-md focus:ring-2 focus:ring-indigo-400"
          >
            <i class="fa-solid fa-bookmark"></i> Change
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
