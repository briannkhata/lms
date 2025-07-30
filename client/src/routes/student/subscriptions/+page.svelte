<script lang="ts">
  import { formatDate } from "$lib/utils/formatDate.js";

  const { data } = $props();
  const { subscriptions } = data;
  console.log("Subscriptions:", subscriptions);
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
        Subscriptions
      </h2>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto px-6 pt-4 pb-6">
      {#if Array.isArray(data.subscriptions) && data.subscriptions.length > 0}
        <table class="w-full min-w-[1000px] text-sm text-gray-800">
          <thead
            class="text-xs uppercase text-gray-500 bg-gray-50 border-b border-gray-200"
          >
            <tr>
              {#each ["#", "Plan", "Start Date", "Expire Date", "Status"] as header}
                <th
                  class="px-4 py-3 text-left tracking-wide font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            {#each data.subscriptions as subscription, index}
              <tr class="group hover:bg-gray-50 transition align-top">
                <td class="px-4 py-3 font-medium whitespace-nowrap">
                  {index + 1}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {subscription.plan.title} ~ {subscription.plan.duration} Days
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {formatDate(subscription.start_date)}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {formatDate(subscription.end_date)}
                </td>

                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                      subscription.status.toString() === "1"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {subscription.status.toString() === "1"
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <div
          class="px-6 py-5 mt-4 text-sm text-yellow-800 bg-yellow-50 border border-yellow-300 rounded-md"
        >
          No Subscriptions Found.
        </div>
      {/if}
    </div>
  </div>
</section>
