<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let formElement: HTMLFormElement;
  export let data;
  const { parcel } = data;

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
      }

      setTimeout(() => {
        goto("/admin/parcels");
      }, 1000);
    };
  }
</script>

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-2xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Update parcel
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Edit the parcel details and save your changes.
      </p>
      <hr class="mt-5 border-t border-gray-200" />
    </div>

    {#if parcel}
      <!-- Form -->
      <form
        method="POST"
        use:enhance={handleSubmit}
        bind:this={formElement}
        class="space-y-8"
      >
        <!-- Hidden ID field -->
        <input type="hidden" id="id" name="id" bind:value={parcel.id} />

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
              bind:value={parcel.name}
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
              bind:value={parcel.location}
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
              bind:value={parcel.coordinates}
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
              bind:value={parcel.parceltype}
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
            bind:value={parcel.description}
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
              bind:value={parcel.o_name}
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
              bind:value={parcel.o_phone}
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
              bind:value={parcel.o_email}
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
              bind:value={parcel.o_address}
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
            <i class="fa-solid fa-floppy-disk text-sm"></i>
            Update
          </button>
        </div>
      </form>
    {:else}
      <!-- Fallback -->
      <div
        class="mt-6 px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
      >
        parcel not found.
      </div>
    {/if}
  </div>
</div>
