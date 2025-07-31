<script lang="ts">
  import "../app.css";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  const options = {
    duration: 4000,
    initial: 1,
    next: 0,
    pausable: true,
    dismissable: true,
    reversed: false,
    intro: { x: 256 },
    style: "width: 350px; max-width: 90%;",
  };
  export let data: any;
  import { page } from "$app/stores";
  import { derived } from "svelte/store";

  const { user } = data;
</script>

<SvelteToast {options} />
<slot />
