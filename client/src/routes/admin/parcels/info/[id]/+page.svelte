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

  let showImageModal = false;
</script>

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-2xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Parcel Details
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        View all the information associated with this parcel.
      </p>
      <hr class="mt-5 border-t border-gray-200" />
    </div>

    {#if parcel}
      <!-- Form -->
      <div class="space-y-8">
        <!-- Parcel Information -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Name -->
          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Name</label
            >
            <p class="text-sm text-gray-900">{parcel.name}</p>
          </div>

          <!-- Location -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Location</label
            >
            <p class="text-sm text-gray-900">{parcel.location}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Coordinates -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Coordinates</label
            >
            <p class="text-sm text-gray-900">{parcel.coordinates}</p>
          </div>

          <!-- Parcel Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Parcel Type</label
            >
            <p class="text-sm text-gray-900">{parcel.parceltype}</p>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Description</label
          >
          <p class="text-sm text-gray-900 whitespace-pre-line">
            {parcel.description}
          </p>
        </div>

        <!-- Owner Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Owner Name</label
            >
            <p class="text-sm text-gray-900">{parcel.o_name}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Owner Phone</label
            >
            <p class="text-sm text-gray-900">{parcel.o_phone}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Owner Email</label
            >
            <p class="text-sm text-gray-900">{parcel.o_email}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Owner Address</label
            >
            <p class="text-sm text-gray-900">{parcel.o_address}</p>
          </div>
        </div>
        <!-- 📸 Add Images Button -->
        <!-- <div class="text-right">
          <button
            onclick={() => (showImageModal = true)}
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <i class="fa-solid fa-image"></i>
            Add Images
          </button>
        </div> -->
      </div>
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
{#if showImageModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
      <!-- Close Button -->
      <button
        onclick={() => (showImageModal = false)}
        class="absolute top-2 right-2 text-gray-500 hover:text-red-600"
      >
        <i class="fa-solid fa-xmark text-xl"></i>
      </button>

      <!-- Modal Header -->
      <h3 class="text-lg font-semibold text-gray-800 mb-4">
        Upload Parcel Images
      </h3>

      <!-- File Input -->
      <form
        method="POST"
        use:enhance={handleSubmit}
        bind:this={formElement}
        enctype="multipart/form-data"
      >
        <input
          type="file"
          name="image"
          accept="image/*"
          class="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 mb-4"
        />

        <input
          type="hidden"
          name="parcel_id"
          id="parcel_id"
          bind:value={parcel.id}
          class="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 mb-4"
        />

        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Upload Image
        </button>
      </form>
    </div>
  </div>
{/if}
