<script lang="ts">
  import { goto } from "$app/navigation";
  //import { onMount } from "svelte";
  import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";
  import { formatToMoney } from "$lib/utils/formatToMoney.js";
  // import { initializeDataTables } from "$lib/utils/initDataTables";
  // onMount(() => {
  //   initializeDataTables();
  // });
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
    goto(`/admin/plans/${String(id)}`);
  };
</script>

<section class="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 bg-gray-50">
  <div
    class="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 pt-6 pb-5 border-b border-gray-100"
    >
      <h2
        class="text-3xl font-semibold text-gray-900 tracking-tight select-none"
      >
        Plans
      </h2>
      <a
        href="/admin/plans/create"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
      >
        <i class="fa-solid fa-plus"></i>
        <span>Create Plan</span>
      </a>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto px-6 pb-6 pt-4">
      {#if Array.isArray(data.plans) && data.plans.length > 0}
        <table class="w-full min-w-[900px] text-sm text-gray-800">
          <thead
            class="text-xs uppercase text-gray-500 bg-gray-50 border-b border-gray-200"
          >
            <tr>
              {#each ["#", "Title", "Duration", "Price", "Description", "Is Free", "Actions"] as header}
                <th
                  class="px-4 py-3 text-left tracking-wide font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            {#each data.plans as plan, index}
              <tr class="group hover:bg-gray-50 transition">
                <td class="px-4 py-3 whitespace-nowrap text-gray-700"
                  >{index + 1}</td
                >
                <td
                  class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap"
                  >{plan?.title ?? "N/A"}</td
                >
                <td class="px-4 py-3 text-gray-900 whitespace-nowrap"
                  >{plan?.duration ?? "N/A"}</td
                >
                <td class="px-4 py-3 text-gray-900 whitespace-nowrap"
                  >{formatToMoney(plan?.price)}</td
                >
                <td class="px-4 py-3 text-gray-700 whitespace-nowrap"
                  >{plan?.description}</td
                >
                <td class="px-4 py-3 text-gray-900 whitespace-nowrap">
                  {#if plan?.is_free == 1}
                    Yes
                  {:else if plan?.is_free == 0}
                    No
                  {:else}
                    N/A
                  {/if}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      onclick={() => editRecord(plan?.id.toString())}
                      class="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center rounded-full focus:ring-2 focus:ring-indigo-400 transition"
                      aria-label="Edit Plan"
                    >
                      <i class="fa-solid fa-pen-to-square text-xs"></i>
                    </button>
                    <button
                      onclick={() => openDeleteModal(plan)}
                      class="w-8 h-8 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-full focus:ring-2 focus:ring-red-400 transition"
                      aria-label="Delete Plan"
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
        <!-- Empty State -->
        <div
          class="px-6 py-5 mt-4 text-sm text-yellow-800 bg-yellow-50 border border-yellow-300 rounded-md"
        >
          No plans found.
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
