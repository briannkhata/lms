<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  let { data } = $props();

  const editRecord = (id: string) => {
    goto(`/admin/parcels/${String(id)}`);
  };

  const viewRecord = (id: string) => {
    goto(`/admin/parcels/info/${String(id)}`);
  };

  function confirmDelete(event) {
    if (!confirm("Are you sure you want to delete this parcel?")) {
      event.preventDefault();
    }
  }
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
        Parcels
      </h2>
      <a
        href="/admin/parcels/create"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
      >
        <i class="fa-solid fa-plus"></i>
        <span>Create Parcel</span>
      </a>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto px-6 pb-6 pt-4">
      {#if Array.isArray(data.parcels) && data.parcels.length > 0}
        <table class="w-full min-w-[1200px] text-sm text-gray-800">
          <thead
            class="text-xs uppercase text-gray-500 bg-gray-50 border-b border-gray-200"
          >
            <tr>
              {#each ["#", "Name", "Description", "Parcel Type", "Owner Name", "Actions"] as header}
                <th
                  class="px-4 py-3 text-left tracking-wide font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            {#each Array.isArray(data.parcels) ? data.parcels : [data.parcels] as parcel, index}
              <tr class="group hover:bg-gray-50 transition">
                <td class="px-4 py-3 whitespace-nowrap text-gray-700"
                  >{index + 1}</td
                >
                <td class="px-4 py-3 text-gray-900 whitespace-nowrap"
                  >{parcel.name}</td
                >

                <td class="px-4 py-3 text-gray-900 whitespace-nowrap"
                  >{parcel.description}</td
                >
                <td class="px-4 py-3 text-gray-900 whitespace-nowrap"
                  >{parcel.parceltype}</td
                >
                <td class="px-4 py-3 text-gray-900 whitespace-nowrap"
                  >{parcel.o_name}</td
                >

                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      onclick={() => editRecord(parcel?.id.toString())}
                      class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onclick={() => viewRecord(parcel?.id.toString())}
                      class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md"
                    >
                      Details
                    </button>
                    <form
                      method="POST"
                      action="?/deleteRecord"
                      use:enhance
                      onsubmit={confirmDelete}
                    >
                      <input type="hidden" name="parcelId" value={parcel.id} />
                      <button
                        type="submit"
                        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                      >
                        Delete
                      </button>
                    </form>
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
          No parcels found.
        </div>
      {/if}
    </div>
  </div>
</section>
