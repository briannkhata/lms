<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { formatToMoney } from "$lib/utils/formatToMoney.js";
  let formElement: HTMLFormElement;
  export let data;
  const { user, plans } = data;

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
          goto("/admin/profile");
        }, 1000);
      }
    };
  }
</script>

{#if user}
  <div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-xl mx-auto">
    <div class="bg-white border border-gray-200 rounded-2xl shadow p-6 md:p-10">
      <!-- Header -->
      <div class="mb-10 text-center">
        <h2 class="text-3xl font-bold text-gray-900">Upgrade Your Plan</h2>
        <p class="text-gray-500 text-sm mt-2">
          Select the plan that best suits your needs.
        </p>
        <hr class="mt-6 border-t border-gray-100" />
      </div>

      <!-- Form -->
      <form
        method="POST"
        use:enhance={handleSubmit}
        bind:this={formElement}
        class="space-y-10"
      >
        <!-- Plan Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each plans as plan}
            {#if plan.is_free === 0}
              <label class="group relative cursor-pointer">
                <input
                  type="radio"
                  name="planId"
                  value={plan.id}
                  class="sr-only peer"
                  required
                />

                <div
                  class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300
                  peer-checked:border-indigo-600 peer-checked:ring-2 peer-checked:ring-indigo-300"
                >
                  <div class="flex justify-between items-start">
                    <h3
                      class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600"
                    >
                      {plan.title}
                    </h3>

                    <!-- Check icon -->
                    <svg
                      class="w-5 h-5 text-indigo-600 opacity-0 peer-checked:opacity-100 transition"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  {#if plan.description}
                    <p class="text-sm text-gray-500 mt-1">{plan.description}</p>
                  {/if}

                  {#if plan.price}
                    <div class="mt-4 text-indigo-600 text-lg font-bold">
                      MKW {formatToMoney(plan.price)}
                    </div>
                  {/if}
                </div>
              </label>
            {/if}
          {/each}
        </div>

        <!-- Submit -->
        <div class="text-center">
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
          >
            <i class="fa-solid fa-paper-plane"></i>
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
