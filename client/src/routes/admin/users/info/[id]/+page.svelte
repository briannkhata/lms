<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let formElement: HTMLFormElement;
  export let data;
  const { user } = data;

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
          goto("/admin/users");
        }, 1000);
      }
    };
  }
</script>

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Student Details
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        View the student information below.
      </p>
      <hr class="mt-5 border-t border-gray-200" />
    </div>

    <!-- Details grid -->
    <div class="space-y-8">
      <!-- Row 1 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-1">Fullname</h3>
          <p class="text-gray-900">{user.name || "-"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-1">Username</h3>
          <p class="text-gray-900">{user.username || "-"}</p>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-1">Email</h3>
          <p class="text-gray-900">{user.email || "-"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-1">Phone</h3>
          <p class="text-gray-900">{user.phone || "-"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-1">Gender</h3>
          <p class="text-gray-900">{user.gender || "-"}</p>
        </div>
      </div>

      <!-- Row 3 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-1">Date of Birth</h3>
          <p class="text-gray-900">{user.date_of_birth || "-"}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-1">Grade Level</h3>
          <p class="text-gray-900">
            {#if gradeLevels.length}
              {gradeLevels.find((level) => level.id == user.grade_level_id)
                ?.name || "-"}
            {:else}
              -
            {/if}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-1">Role</h3>
          <p class="text-gray-900">{user.role || "-"}</p>
        </div>
      </div>

      <!-- Plan -->
      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-1">Plan</h3>
        <p class="text-gray-900">
          {#if plans.length}
            {plans.find((plan) => plan.id == user.plan_id)?.title +
              " of " +
              plans.find((plan) => plan.id == user.plan_id)?.duration +
              " Days" || "-"}
          {:else}
            -
          {/if}
        </p>
      </div>
    </div>
  </div>
</div>
