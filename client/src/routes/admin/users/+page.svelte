<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { formatDate } from "$lib/utils/formatDate.js";
  import ConfirmDeleteModal from "$lib/components/ConfirmDeleteModal.svelte";
  import { writable } from "svelte/store";

  interface User {
    id: string;
    name: string;
    username: string;
    date_of_birth: string;
    gender: string;
    phone: string;
    district: string;
    role: string;
    deleted: number;
    created_at: string;
    gradelevel: {
      name: string;
    };
  }

  interface Props {
    users: User[] | User;
  }

  export let data: Props;

  const showModal = writable(false);
  const itemToDelete = writable<User | null>(null);

  function openDeleteModal(item: User) {
    itemToDelete.set(item);
    showModal.set(true);
  }

  function closeModal() {
    showModal.set(false);
    itemToDelete.set(null);
  }

  function editRecord(id: string) {
    goto(`/admin/users/${id}`);
  }

  function viewRecord(id: string) {
    goto(`/admin/users/info/${id}`);
  }

  function statusBadgeClasses(deleted: number): string {
    return deleted === 0
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
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
        <span>Create User | Admin</span>
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
              {#each ["#", "Name", "Class", "Registered", "Plan", "Role", "Status", "Actions"] as header}
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
                <td
                  class="px-4 py-3 text-gray-700 font-medium whitespace-nowrap"
                  >{index + 1}</td
                >
                <td class="px-4 py-3 whitespace-nowrap font-medium"
                  >{user.name}</td
                >

                <td class="px-4 py-3 whitespace-nowrap"
                  >{user.gradelevel?.name ?? "N/A"}</td
                >
                <td class="px-4 py-3 whitespace-nowrap"
                  >{formatDate(user.created_at)}</td
                >
                <td class="px-4 py-3 whitespace-nowrap"
                  >{user.plan?.title ?? "N/A"}</td
                >

                <td class="px-4 py-3 whitespace-nowrap">{user.role}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      user.deleted === 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.deleted === 0 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      on:click={() => editRecord(user.id)}
                      class="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center rounded-full focus:ring-2 focus:ring-blue-400 transition"
                      aria-label="Edit"
                      title="Reset Password"
                    >
                      <i class="fa-solid fa-lock-open text-xs"></i>
                    </button>
                    <!-- 
                    <button
                      on:click={() => viewRecord(user.id)}
                      class="w-8 h-8 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center rounded-full focus:ring-2 focus:ring-green-400 transition"
                      aria-label="View"
                      title="View User"
                    >
                      <i class="fa-solid fa-eye text-xs"></i>
                    </button> -->

                    <button
                      on:click={() => openDeleteModal(user)}
                      class="w-8 h-8 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-full focus:ring-2 focus:ring-red-400 transition"
                      aria-label="Delete"
                      title="Delete User"
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
          No users found.
        </div>
      {/if}
    </div>
  </div>
</section>

{#if $showModal}
  <ConfirmDeleteModal
    show={$showModal}
    item={$itemToDelete}
    on:cancel={closeModal}
  />
{/if}
