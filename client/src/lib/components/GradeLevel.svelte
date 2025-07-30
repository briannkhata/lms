<script lang="ts">
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";

  export let grade:PageData;
</script>

<div 
  class="cursor-pointer bg-white shadow-md hover:shadow-lg rounded-2xl p-4 transition-all duration-200 border border-gray-200"
  on:click={() => goto(`/users/${grade.id}`)}
>
  <h2 class="text-xl font-semibold text-gray-800 mb-1">{grade.name}</h2>
  <p class="text-gray-600">{grade.description}</p>
</div>