<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let formElement: HTMLFormElement;

  export let data;

  const { lessons } = data;

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
        goto("/admin/folders");
      }, 1000);
    };
  }

  let search = "";
  //export let lessons = [];

  // Filtered lessons based on search input
  $: filteredLessons = lessons.filter((lesson) =>
    `${lesson.code} ${lesson.folder.name} ${lesson.gradelevel.name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
</script>

{#if lessons && lessons.length > 0}
  <div class="pt-20 pb-16 px-4 md:px-8 max-w-screen-2xl mx-auto">
    <!-- Top Bar -->
    <div
      class="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
    >
      <h2 class="text-4xl font-bold text-gray-900">Available Lessons</h2>

      <!-- Search -->
      <div class="w-full md:w-1/3">
        <input
          type="text"
          bind:value={search}
          placeholder="Search by title, grade, or folder..."
          class="w-full px-5 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm transition"
        />
      </div>
    </div>

    <!-- Lessons Grid -->
    <div class="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each filteredLessons as lesson}
        <div
          class="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm hover:shadow-md transition duration-300 group"
        >
          <!-- Thumbnail -->
          <div class="relative">
            <img
              src={lesson.thumbnail ||
                "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"}
              alt={lesson.code}
              class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"
            />
            <div class="absolute inset-0 flex items-center justify-center">
              <svg
                class="w-10 h-10 text-white opacity-80"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 4l12 6-12 6V4z" />
              </svg>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4 space-y-1.5">
            <h3 class="text-md font-semibold text-gray-900 truncate">
              {lesson.code}
            </h3>
            <p class="text-sm text-gray-600 truncate">{lesson.folder.name}</p>
            <p class="text-xs text-gray-500 truncate">
              {lesson.gradelevel.name}
            </p>
          </div>
        </div>
      {/each}
    </div>

    <!-- No Matches -->
    {#if filteredLessons.length === 0}
      <div class="mt-16 text-center">
        <p class="text-gray-600 text-lg">No lessons match your search.</p>
      </div>
    {/if}
  </div>
{:else}
  <!-- No Lessons Fallback -->
  <div class="pt-32 text-center">
    <h3 class="text-2xl font-semibold text-gray-700 mb-2">
      No Lessons Available
    </h3>
    <p class="text-gray-500">
      Check back later as new content is added regularly.
    </p>
  </div>
{/if}
