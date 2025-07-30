<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let formElement: HTMLFormElement;
  export let data;
  const { user, userOne } = data;

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
        } else if (data?.message) {
          toast.push(data?.message, {
            theme: {
              "--toastBackground": "#e53e3e",
              "--toastBarBackground": "#c53030",
              "--toastColor": "white",
            },
          });
        }
        return; // Important: prevent further execution
      }

      if (type === "success") {
        toast.push(data?.message, {
          theme: {
            "--toastBackground": "#38a169",
            "--toastBarBackground": "#2f855a",
            "--toastColor": "white",
          },
        });

        // ✅ Only redirect on success
        setTimeout(() => {
          goto("/admin/profile");
        }, 1000);
      }
    };
  }
</script>

{#if user}
  <div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-xl mx-auto">
    <div
      class="bg-white border border-gray-200 rounded-md shadow-sm p-6 md:p-8"
    >
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 select-none">
          Update Profile
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          Fill in the details below to update your details.
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
        <!-- First Row -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Fullname <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            bind:value={userOne.name}
            placeholder="e.g., Brian Nkhata"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            id="id"
            name="id"
            type="hidden"
            bind:value={userOne.id}
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Username <span class="text-red-500">*</span>
            </label>
            <input
              bind:value={userOne.username}
              disabled
              type="text"
              placeholder="e.g., brian123"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Email <span class="text-red-500">*</span></label
            >
            <input
              id="email"
              name="email"
              type="email"
              bind:value={userOne.email}
              placeholder="e.g., brian@example.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          <div>
            <label
              for="phone"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone <span class="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              bind:value={userOne.phone}
              placeholder="e.g., +265 991 234 567"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <!-- Third Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="gender"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Gender <span class="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              bind:value={userOne.gender}
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option disabled selected value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label
              for="date_of_birth"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Date of Birth <span class="text-red-500">*</span>
            </label>
            <input
              id="date_of_birth"
              name="date_of_birth"
              bind:value={userOne.date_of_birth}
              type="date"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <!-- Fourth Row -->

        <!-- Fifth Row: Location Details -->
        <div>
          <label
            for="address"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Address <span class="text-red-500">*</span>
          </label>
          <input
            id="address"
            name="address"
            bind:value={userOne.address}
            type="text"
            placeholder="Street Address"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              for="city"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              City <span class="text-red-500">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              bind:value={userOne.city}
              placeholder="e.g., Lilongwe"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label
              for="district"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              District <span class="text-red-500">*</span>
            </label>
            <input
              id="district"
              name="district"
              type="text"
              bind:value={userOne.district}
              placeholder="e.g., Central"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label
              for="town"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Town <span class="text-red-500">*</span>
            </label>
            <input
              id="town"
              name="town"
              type="text"
              bind:value={userOne.town}
              placeholder="e.g., Area 18"
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>

        <!-- School -->
        <div>
          <label
            for="current_school"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Current School <span class="text-red-500">*</span>
          </label>
          <input
            id="current_school"
            name="current_school"
            type="text"
            bind:value={userOne.current_school}
            placeholder="e.g., St. Andrews International"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <!-- Submit -->
        <div class="text-left">
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 rounded-md focus:ring-2 focus:ring-indigo-400"
          >
            <i class="fa-solid fa-bookmark"></i> Update
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
