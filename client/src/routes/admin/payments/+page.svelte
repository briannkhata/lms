<script lang="ts">
  import { formatDate } from "$lib/utils/formatDate";
  import { formatToMoney } from "$lib/utils/formatToMoney";
  import { onMount } from "svelte";
  onMount(() => {
    const script = document.createElement("script");
    script.src = "/assets/js/datatables/datatables.init.js";
    document.body.appendChild(script);
  });

  let { data } = $props();
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
        Payments
      </h2>

      <!-- No create button here, remove if you don't want one -->
      <!-- Or add if you want something like 'Add Payment' -->
    </div>

    <!-- Table -->
    <div class="overflow-x-auto px-6 pb-6 pt-4">
      {#if Array.isArray(data.payments) && data.payments.length > 0}
        <table class="w-full min-w-[900px] text-sm text-gray-800">
          <thead
            class="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500"
          >
            <tr>
              {#each ["#", "Payment Mode", "Amount", "Plan", "Date"] as header}
                <th
                  class="px-4 py-3 text-left tracking-wide font-semibold whitespace-nowrap"
                >
                  {header}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            {#each data.payments as payment, index}
              <tr class="group hover:bg-gray-50 transition">
                <td class="px-4 py-3 text-gray-700 whitespace-nowrap"
                  >{index + 1}</td
                >
                <td class="px-4 py-3 text-gray-900 whitespace-nowrap"
                  >{payment.payment_mode}</td
                >
                <td class="px-4 py-3 text-gray-900 whitespace-nowrap"
                  >MKW {formatToMoney(payment.amount)}</td
                >
                <td class="px-4 py-3 text-gray-700 whitespace-nowrap"
                  >{payment.plan?.title ?? "N/A"}</td
                >
                <td class="px-4 py-3 text-gray-700 whitespace-nowrap"
                  >{formatDate(payment.created_at)}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      {:else}
        <div
          class="px-6 py-5 mt-4 text-sm text-yellow-800 bg-yellow-50 border border-yellow-300 rounded-md"
        >
          No payments found.
        </div>
      {/if}
    </div>
  </div>
</section>
