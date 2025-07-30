<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let formElement: HTMLFormElement;

  export let data;

  const { gradelevels, folder } = data;

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
        goto("/admin/folders");
      }, 1000);
    };
  }
</script>

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-2xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Update Folder
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Modify the details below to update this folder.
      </p>
      <hr class="mt-5 border-t border-gray-200" />
    </div>

    {#if folder}
      <form
        method="POST"
        use:enhance={handleSubmit}
        bind:this={formElement}
        class="space-y-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Name Field -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Folder Name <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              bind:value={folder.name}
              placeholder="e.g. Fractions"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <input type="hidden" id="id" name="id" bind:value={folder.id} />
          </div>

          <div>
            <label
              for="grade_level_id"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Grade Level <span class="text-red-500">*</span>
            </label>
            <select
              id="grade_level_id"
              name="grade_level_id"
              bind:value={folder.grade_level_id}
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option disabled selected value="">Select Grade</option>
              {#each gradelevels as level}
                <option value={level.id}>
                  {level.name} | {level.description}
                </option>
              {/each}
            </select>
          </div>
        </div>
        <!-- Description Field -->
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Description <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="description"
            name="description"
            bind:value={folder.description}
            placeholder="e.g. This folder is for Fraction lessons"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
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
      <p class="text-red-600">Folder Not Found</p>
    {/if}
  </div>
</div>
