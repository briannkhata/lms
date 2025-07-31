<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let formElement: HTMLFormElement;
  export let data;
  const { subject } = data;

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
        } else {
          toast.push(data?.message, {
            theme: {
              "--toastBackground": "#e53e3e",
              "--toastBarBackground": "#c53030",
              "--toastColor": "white",
            },
          });
        }
      }

      if (type === "success") {
        toast.push(data?.message || "Registration successful!", {
          theme: {
            "--toastBackground": "#38a169",
            "--toastBarBackground": "#2f855a",
            "--toastColor": "white",
          },
        });
      }

      setTimeout(() => {
        goto("/admin/subjects");
      }, 1000);
    };
  }
</script>

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-2xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Update Subject
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Edit the subject details and save your changes.
      </p>
      <hr class="mt-5 border-t border-gray-200" />
    </div>

    {#if subject}
      <!-- Form -->
      <form
        method="POST"
        use:enhance={handleSubmit}
        bind:this={formElement}
        class="space-y-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Code Field -->
          <div class="col-span-1">
            <label
              for="code"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Code <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              name="code"
              bind:value={subject.code}
              placeholder="e.g. ENG101"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <input type="hidden" id="id" name="id" bind:value={subject.id} />
          </div>

          <!-- Name Field -->
          <div class="col-span-1 md:col-span-2">
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              bind:value={subject.name}
              placeholder="e.g. English Language"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="text-left">
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            <i class="fa-solid fa-floppy-disk text-sm"></i>
            Update
          </button>
        </div>
      </form>
    {:else}
      <!-- Fallback -->
      <div
        class="mt-6 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
      >
        Subject not found.
      </div>
    {/if}
  </div>
</div>
