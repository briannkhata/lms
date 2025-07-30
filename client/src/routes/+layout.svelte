<script lang="ts">
  import TopMenu from "$lib/components/TopMenu.svelte";
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
  import TopMenuStudent from "$lib/components/TopMenuStudent.svelte";

  $: protectedRoute =
    $page.url.pathname.startsWith("/admin") ||
    $page.url.pathname.startsWith("/student") ||
    $page.url.pathname.startsWith("/login") ||
    $page.url.pathname.startsWith("/register");

  const isLoginRegister = derived(page, ($page) =>
    ["/login", "/register"].includes($page.url.pathname)
  );

  const isHomePage = derived(page, ($page) =>
    ["/"].includes($page.url.pathname)
  );

  //export let data;
  const { user } = data;
</script>

<!-- {#if $isHomePage}
  <TopMenu {data} />
{/if} -->

<SvelteToast {options} />
<slot />
{#if $isHomePage}
  <!-- <footer
    class="bg-white border-t border-gray-200 text-gray-700 py-6 select-none"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-md font-medium"
    >
      <p>&copy; 2025 Foxuls Academy. Built for everyone.</p>
    </div>
  </footer> -->
{/if}
