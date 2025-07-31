<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";

  let formElement: HTMLFormElement;
  export let data;
  const { users, plans } = data;

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
        } else {
          toast.push(data?.message || "Registration failed.", {
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
        formElement.reset();
      }
    };
  }
</script>

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-2xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Create Subscription
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Fill in the details below to assign a subscription to a student.
      </p>
      <hr class="mt-5 border-t border-gray-200" />
    </div>

    <!-- Form -->
    <form
      method="POST"
      use:enhance={handleSubmit}
      bind:this={formElement}
      class="space-y-8"
    >
      <!-- Student & Plan -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Student -->
        <div>
          <label
            for="user_id"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Student <span class="text-red-500">*</span>
          </label>
          <select
            id="user_id"
            name="user_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option disabled selected value="">Select a student</option>
            {#each users as student}
              <option value={student.id}>
                {student.name}
              </option>
            {/each}
          </select>
        </div>

        <!-- Plan -->
        <div>
          <label
            for="plan_id"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Plan <span class="text-red-500">*</span>
          </label>
          <select
            id="plan_id"
            name="plan_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option disabled selected value="">Select a plan</option>
            {#each plans as plan}
              <option value={plan.id}>
                {plan.title} - {plan.duration} Days
              </option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Start Date & Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="start_date"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Start Date <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <div>
          <label
            for="status"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Status <span class="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option disabled selected value="">Select status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Submit -->
      <div class="text-left">
        <button
          type="submit"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <i class="fa-solid fa-plus text-sm"></i>
          Add
        </button>
      </div>
    </form>
  </div>
</div>
