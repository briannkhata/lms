<script lang="ts">
  const { data } = $props();
</script>

<section
  class="bg-gradient-to-br from-blue-100 to-blue-200 min-h-screen flex items-center justify-center px-4"
>
  <div class="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-extrabold text-blue-800 mb-1">LMS</h1>
      <p class="text-sm text-gray-500">
        Welcome back! Please log in to continue.
      </p>
    </div>

    <form class="space-y-5">
      <div>
        <label
          for="username"
          class="block text-sm font-medium text-gray-700 mb-1">Username</label
        >
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 mb-1">Password</label
        >
        <input
          type="password"
          id="password"
          name="password"
          required
          placeholder="••••••••"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
      >
        Log In
      </button>
    </form>
  </div>
</section>
