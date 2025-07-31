<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  let formElement: HTMLFormElement;

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
        } else {
          toast.push(data?.message, {
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
        Create Parcel
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Fill in the details below to add a new parcel.
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Name Field -->
        <div class="col-span-1 md:col-span-2">
          <label
            for="name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="e.g. Plot 12/231"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <!-- Location Field -->
        <div class="col-span-1">
          <label
            for="location"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g. Lilongwe Area 18"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Coordinates Field -->
        <div>
          <label
            for="coordinates"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Coordinates
          </label>
          <input
            type="text"
            id="coordinates"
            name="coordinates"
            placeholder="e.g. -13.9626, 33.7741"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <!-- Parcel Type Field -->
        <div>
          <label
            for="parceltype"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Parcel Type
          </label>
          <select
            id="parceltype"
            name="parceltype"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="" disabled selected>Select type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Land">Land</option>
            <option value="House">House</option>
          </select>
        </div>
      </div>

      <!-- Description Field -->
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="2"
          placeholder="Additional details about the parcel..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
        ></textarea>
      </div>

      <!-- Owner Info Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Owner Name -->
        <div>
          <label
            for="o_name"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Owner Name
          </label>
          <input
            type="text"
            id="o_name"
            name="o_name"
            placeholder="e.g. John Banda"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <!-- Owner Phone -->
        <div>
          <label
            for="o_phone"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Owner Phone
          </label>
          <input
            type="tel"
            id="o_phone"
            name="o_phone"
            placeholder="e.g. +265 999 123 456"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <!-- Owner Email -->
        <div>
          <label
            for="o_email"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Owner Email
          </label>
          <input
            type="email"
            id="o_email"
            name="o_email"
            placeholder="e.g. owner@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        <!-- Owner Address -->
        <div>
          <label
            for="o_address"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Owner Address
          </label>
          <input
            type="text"
            id="o_address"
            name="o_address"
            placeholder="e.g. Area 3, Lilongwe"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      <!-- Submit Button -->
      <div class="text-left">
        <button
          type="submit"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <i class="fa-solid fa-plus text-sm"></i>
          Add Parcel
        </button>
      </div>
    </form>
  </div>
</div>
