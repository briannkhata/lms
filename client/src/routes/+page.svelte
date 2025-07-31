<script lang="ts">
  import { goto } from "$app/navigation";
  import { pushToast } from "$lib/utils/pushToast";
  import { enhance } from "$app/forms";

  export let form: HTMLFormElement;
  const username = "jo";
  const password = "jo";
  const handleSubmit = () => {
    return ({ result }) => {
      form.reset();

      if (result.type === "failure") {
        const { errors, message } = result.data;
        if (errors) {
          Object.values(errors).forEach(
            (val) => val && pushToast(val.toString())
          );
        } else {
          pushToast(message || "Something went wrong.");
        }
      }
      if (result.type === "success") {
        goto("/admin");
      }
    };
  };
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

    <form
      method="POST"
      use:enhance={handleSubmit}
      bind:this={form}
      class="space-y-4"
    >
      <div>
        <label
          for="username"
          class="block text-sm font-medium text-gray-700 mb-1">Username</label
        >
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          placeholder="Enter your username"
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
          value={password}
          placeholder="Enter Password"
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
