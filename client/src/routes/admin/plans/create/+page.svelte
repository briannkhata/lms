<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  let formElement: HTMLFormElement;

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

        formElement.reset();
      }
    };
  }
</script>

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-2xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Create Plan
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Fill in the details below to add a new plan.
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
      <!-- Title -->
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
          Title <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Free Plan"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          required
        />
      </div>

      <!-- Duration and Price in a Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="duration"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Duration (days) <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            placeholder="e.g. 10"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            required
          />
        </div>

        <div>
          <label
            for="price"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Price (MKW)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="0.00"
            step="0.01"
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      <!-- Description -->
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          placeholder="Free Plan"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        />
      </div>

      <!-- Is Free -->
      <div>
        <label
          for="is_free"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Is Free?
        </label>
        <select
          id="is_free"
          name="is_free"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        >
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
      </div>

      <!-- Submit Button -->
      <div class="text-left">
        <button
          type="submit"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <i class="fa-solid fa-plus text-sm"></i>
          Add
        </button>
      </div>
    </form>
  </div>
</div>
