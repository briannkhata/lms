<script lang="ts">
  export let data;
  const { folders } = data;

  import { goto } from "$app/navigation";

  console.log(data.user);
  console.log(data.folders);

  function openFolder(id: string) {
    goto(`/${data.user.role}/folders/${id}`);
  }
</script>

<main class="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-10">
  <h3 class="text-3xl sm:text-4xl font-semibold text-gray-800 mb-8 select-none">
    Grade 1 Academic Resources
  </h3>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
  >
    {#if Array.isArray(folders)}
      {#each folders as folder}
        <div
          class="group bg-white rounded-md border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-6 ring-0 focus:ring-2 focus:ring-indigo-400 outline-none"
          tabindex="0"
          on:click={() => openFolder(folder.id)}
        >
          <div class="flex items-center justify-between mb-4">
            <h2
              class="text-xl font-bold text-indigo-700 flex items-center gap-2"
            >
              <i
                class="fa-solid fa-book-open text-indigo-500"
                aria-hidden="true"
              ></i>
              <span class="group-hover:text-indigo-800 transition"
                >{folder.name}</span
              >
            </h2>
            <!-- <span
              class="text-sm text-gray-500 bg-indigo-100 rounded-full px-2 py-1"
            >
            </span> -->
          </div>

          <p class="text-gray-600 text-base leading-relaxed mb-2">
            {folder.description}
          </p>

          <div class="mt-3 flex items-center justify-between">
            <span class="text-xs text-gray-400">Click to view folder</span>
            <i
              class="fa-solid fa-arrow-right text-indigo-400 group-hover:text-indigo-600 transition"
            ></i>
          </div>
        </div>
      {/each}
    {/if}
  </div>
</main>
