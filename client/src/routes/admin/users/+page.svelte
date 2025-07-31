<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  const { data } = $props();

  function editRecord(id: string) {
    goto(`/admin/users/${id}`);
  }
  function confirmDelete(event) {
    if (!confirm("Are you sure you want to delete this parcel?")) {
      event.preventDefault();
    }
  }
</script>

<section class="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 bg-gray-50">
  <div
    class="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden"
  >
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 pt-6 pb-5 border-b border-gray-100"
    >
      <h2
        class="text-3xl font-semibold text-gray-900 tracking-tight select-none"
      >
        Users
      </h2>
      <a
        href="/admin/users/create"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition"
      >
        <i class="fa-solid fa-plus"></i>
        <span>Create User</span>
      </a>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto px-6 pt-4 pb-6">
      {#if Array.isArray(data.users) && data.users.length > 0}
        <table class="w-full min-w-[1000px] text-sm text-gray-800">
          <thead
            class="text-xs uppercase text-gray-500 bg-gray-50 border-b border-gray-200"
          >
            <tr>
              {#each ["#", "Name", "Username", "Phone", "Email", "Role", "Actions"] as header}
                <th
                  class="px-4 py-3 text-left tracking-wide font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            {#each data.users as user, index}
              <tr class="group hover:bg-gray-50 transition align-top">
                <td class="px-4 py-3 font-medium whitespace-nowrap">
                  {index + 1}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {user.name}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {user.username}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {user.phone}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {user.email}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {user.role}
                </td>

                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      onclick={() => editRecord(user?.id.toString())}
                      class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md"
                    >
                      Edit
                    </button>

                    <form
                      method="POST"
                      action="?/deleteRecord"
                      use:enhance
                      onsubmit={confirmDelete}
                    >
                      <input type="hidden" name="parcelId" value={user.id} />
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
        <div
          class="px-6 py-5 mt-4 text-sm text-yellow-800 bg-yellow-50 border border-yellow-300 rounded-md"
        >
          No users found.
        </div>
      {/if}
    </div>
  </div>
</section>
