<script lang="ts">
  import { goto } from "$app/navigation";
  import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";
  import { toast } from "@zerodevx/svelte-toast";

  let { data } = $props();

  let showModal = $state(false);
  let itemToDelete = $state(null);

  function openDeleteModal(item: any) {
    itemToDelete = item;
    showModal = true;
  }

  function closeModal() {
    console.log("Closing modal");
    showModal = false;
    itemToDelete = null;
  }

  const editRecord = (id: string) => {
    goto(`/admin/folders/${String(id)}`);
  };

  //console.log(data.folders);
   console.log(data.folders);
</script>

<section class="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 bg-gray-50">
  <div
    class="bg-white border border-gray-200 shadow-sm rounded-md overflow-hidden"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 pt-6 pb-5 border-b border-gray-100"
    >
      <h2
        class="text-3xl font-semibold text-gray-900 tracking-tight select-none"
      >
        Folders
      </h2>

      <a
        href="/admin/folders/create"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
      >
        <i class="fa-solid fa-plus"></i>
        <span>Create Folder</span>
      </a>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto px-6 pb-6 pt-4">
      {#if Array.isArray(data.folders) && data.folders.length > 0}
        <table class="w-full min-w-[900px] text-sm text-gray-800">
          <thead
            class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500"
          >
            <tr>
              {#each ["#", "Name", "Description", "GradeLevel", "Actions"] as header}
                <th
                  class="px-4 py-3 text-left tracking-wide font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            {#each data.folders as folder, index}
              <tr class="group hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {index + 1}
                </td>
                <td
                  class="px-4 py-3 text-gray-900 font-medium whitespace-nowrap"
                >
                  {folder?.name ?? "N/A"}
                </td>
                <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {folder?.description}
                </td>
                <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {folder?.gradelevel?.name ?? "N/A"}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <!-- Edit Button -->
                    <button
                      onclick={() => editRecord(folder?.id.toString())}
                      class="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center rounded-full focus:ring-2 focus:ring-blue-400 transition"
                      aria-label="Edit Folder"
                    >
                      <i class="fa-solid fa-pen-to-square text-xs"></i>
                    </button>
                    <!-- Delete Button -->
                    <button
                      onclick={() => openDeleteModal(folder)}
                      class="w-8 h-8 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-full focus:ring-2 focus:ring-red-400 transition"
                      aria-label="Delete Folder"
                    >
                      <i class="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <div
          class="px-6 py-5 mt-4 text-sm text-yellow-800 bg-yellow-50 border border-yellow-300 rounded-md"
        >
          No Folders Found.
        </div>
      {/if}
    </div>
  </div>
</section>

{#if showModal}
  <ConfirmDeleteModal
    show={showModal}
    item={itemToDelete}
    on:cancel={closeModal}
  />
{/if}
