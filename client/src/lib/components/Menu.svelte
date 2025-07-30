<script lang="ts">
  import { jwtDecode } from "jwt-decode";

  export let form;

  let userData = null;

  $: if (form?.token) {
    try {
      userData = jwtDecode(form.token);
      console.log("Decoded token data:", userData);
    } catch (e) {
      console.error("Invalid token:", e);
      userData = null;
    }
  }
</script>

{#if userData}
  <h2>User Info from Token:</h2>
  <ul>
    {#each Object.entries(userData) as [key, value]}
      <li><strong>{key}:</strong> {value}</li>
    {/each}
  </ul>
{:else}
  <p>No user data available.</p>
{/if}
