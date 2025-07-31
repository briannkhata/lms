<script lang="ts">
  export let data;

  const { parcels, users } = data;

  const parcelCount = Array.isArray(parcels) ? parcels.length : 0;
  const userCount = Array.isArray(users) ? users.length : 0;
</script>

<main class="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-10">
  <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 select-none">
    Dashboard
  </h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <!-- Parcels Card -->
    <a
      href="/admin/parcels"
      class="block bg-white shadow-md rounded-2xl p-6 transition hover:shadow-lg hover:bg-green-50"
    >
      <h2 class="text-lg font-semibold text-gray-700">Parcels</h2>
      <p class="text-3xl font-bold text-green-600 mt-2">{parcelCount}</p>
      <!-- Replace with dynamic count -->
    </a>

    <!-- Users Card -->
    <a
      href="/admin/users"
      class="block bg-white shadow-md rounded-2xl p-6 transition hover:shadow-lg hover:bg-purple-50"
    >
      <h2 class="text-lg font-semibold text-gray-700">Users</h2>
      <p class="text-3xl font-bold text-purple-600 mt-2">{userCount}</p>
      <!-- Replace with dynamic count -->
    </a>
  </div>
</main>
