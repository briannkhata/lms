<script lang="ts">
  import { enhance } from "$app/forms";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let show = false;
  export let item = null;

  export let onCancel = () => {
    console.log("Cancel clicked");
    dispatch("cancel");
  };

  function handleKeydown(event) {
    if (event.key === "Escape") {
      onCancel();
    }
  }

  function handleSuccess() {
    dispatch("cancel");
  }
</script>

{#if show}
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm px-4"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    on:keydown={handleKeydown}
  >
    <div
      class="w-full max-w-md bg-white dark:bg-zinc-700 rounded-xl shadow-2xl p-6 sm:p-7 space-y-5"
      on:click|stopPropagation
      tabindex="0"
    >
      <!-- Header -->
      <div class="space-y-1">
        <h2
          class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2"
        >
          <i class="fa-solid fa-triangle-exclamation text-red-600"></i>
          Confirm Deletion
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to delete this record? This action cannot be
          undone.
        </p>
      </div>

      <!-- Optional contextual name -->
      {#if item?.name}
        <p class="text-sm text-gray-800 dark:text-gray-200">
          Item: <span class="font-medium text-red-600 dark:text-red-400"
            >{item.name}</span
          >
        </p>
      {/if}

      <!-- Buttons -->
      <form method="POST" action="?/deleteRecord" use:enhance={handleSuccess}>
        <input type="hidden" name="id" value={item?.id} />

        <div class="flex justify-end gap-3 pt-4">
          <!-- Cancel -->
          <button
            type="button"
            on:click={onCancel}
            class="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:bg-zinc-700 dark:hover:bg-zinc-600 transition"
          >
            Cancel
          </button>

          <!-- Delete -->
          <button
            type="submit"
            name="deleteRecord"
            class="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-1 focus:ring-red-400 dark:focus:ring-offset-zinc-800 transition"
          >
            <i class="fa-solid fa-trash-can mr-1"></i> Delete
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
