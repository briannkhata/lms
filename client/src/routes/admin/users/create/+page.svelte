<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";

  let formElement: HTMLFormElement;
  export let data;
  let showPassword = false;
  let showConfirmPassword = false;
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

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Create User | Admin
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Fill in the details below to register a new user.
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
        <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
          Fullname <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="e.g., Brian Nkhata"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Username <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="e.g., brian123"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <div class="relative">
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Password <span class="text-red-500">*</span>
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter a strong password"
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="button"
            class="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onclick={() => (showPassword = !showPassword)}
            tabindex="-1"
          >
            <i class={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            ></i>
          </button>
        </div>
      </div>

      <!-- Second Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option disabled selected value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <!-- <div>
          <label
            for="date_of_birth"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Date of Birth <span class="text-red-500">*</span>
          </label>
          <input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div> -->

        <div>
          <label
            for="role"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Role <span class="text-red-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            <!-- <option disabled selected value="">Select Role</option> -->
            <!-- <option value="student">Student</option> -->
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <!-- Fourth Row -->
      <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="grade_level_id"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Grade Level
          </label>
          <select
            id="grade_level_id"
            name="grade_level_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option disabled selected value="">Select Grade Level</option>
            {#each gradeLevels as level}
              <option value={level.id}
                >{level.name} | {level.description}</option
              >
            {/each}
          </select>
        </div> -->

      <!-- <div>
          <label
            for="plan_id"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Plan
          </label>
          <select
            id="plan_id"
            name="plan_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option disabled selected value="">Select Plan</option>
            {#each plans as plan}
              <option value={plan.id}
                >{plan.title} of {plan.duration} Days</option
              >
            {/each}
          </select>
        </div>
      </div> -->

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
          type="text"
          placeholder="Street Address"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>
      <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            placeholder="e.g., Area 18"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div> -->

      <!-- School -->
      <!-- <div>
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
          placeholder="e.g., St. Andrews International"
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div> -->

      <!-- Submit -->
      <div class="text-left">
        <button
          type="submit"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 rounded-md focus:ring-2 focus:ring-indigo-400"
        >
          <i class="fa-solid fa-plus text-sm"></i>
          Add
        </button>
      </div>
    </form>
  </div>
</div>
