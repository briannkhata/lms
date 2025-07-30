<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  import { initializeDataTables } from "$lib/utils/initDataTables";
  import "../../app.css";

  onMount(() => {
    initializeDataTables();
  });

  export let data;
  const { user } = data;

  let mobileMenuOpen = false;
  let configOpen = false;
  let userOpen = false;

  const toggleMobileMenu = () => {
    mobileMenuOpen = !mobileMenuOpen;
  };

  const logout = () => {
    fetch("/logout", { method: "POST" }).then(() => {
      invalidateAll();
      goto("/", { replaceState: true });
    });
  };

  const changePassword = () => {
    if (!user?.role) return;
    goto(`/${user.role}/changepassword`);
  };

  const upgradePlan = () => {
    if (!user?.role) return;
    goto(`/${user.role}/upgrade`);
  };

  const viewProfile = () => {
    if (!user?.role) return;
    goto(`/${user.role}/profile`);
  };

  function clickOutside(node: HTMLElement) {
    const handleClick = (event: MouseEvent) => {
      if (!node.contains(event.target as Node)) {
        node.dispatchEvent(new CustomEvent("outclick"));
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  }
</script>

<div id="app" class="flex flex-col min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
    >
      <!-- Logo -->
      <a href="/{user.role}" class="flex flex-col group select-none">
        <span
          class="text-2xl font-extrabold text-indigo-600 group-hover:scale-105 transition-transform"
        >
          Foxuls<span class="text-sm align-super ml-1 text-indigo-400"
            >&trade;</span
          >
        </span>
        <span
          class="text-xs text-gray-500 uppercase tracking-widest font-medium group-hover:text-gray-700"
        >
          Academy
        </span>
      </a>

      <!-- Desktop Nav -->
      <nav
        class="hidden md:flex items-center space-x-6 text-md text-gray-700 font-medium"
      >
        <a
          href="/{user.role}"
          class="flex items-center gap-2 hover:text-indigo-600 transition"
        >
          <i class="fa-solid fa-book-open text-blue-600"></i>
          Lessons
        </a>

        <a
          href="/{user.role}/subscriptions"
          class="flex items-center gap-2 hover:text-indigo-600 transition"
        >
          <i class="fa-solid fa-credit-card text-blue-600"></i>
          Subscriptions
        </a>

        <a
          href="/{user.role}/upgradeplan"
          class="flex items-center gap-2 hover:text-indigo-600 transition"
        >
          <i class="fa-solid fa-arrow-up-right-dots text-blue-600"></i>
          Upgrade Plan
        </a>

        <!-- User Menu -->
        {#if user}
          <div class="relative" use:clickOutside>
            <button
              onclick={() => {
                userOpen = !userOpen;
                configOpen = false;
              }}
              class="flex items-center gap-2 hover:text-indigo-600 transition"
            >
              <i class="fa-solid fa-user-circle text-blue-600 text-lg"></i>
              {user.name} - {user.role}
              <i class="fa-solid fa-caret-down text-xs text-blue-600"></i>
            </button>

            {#if userOpen}
              <div
                class="absolute mt-2 bg-white border rounded shadow-lg w-60 z-50"
              >
                <ul class="text-sm text-gray-700 p-2 space-y-1">
                  <li>
                    <button
                      class="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                      onclick={() => {
                        viewProfile();
                        userOpen = false;
                      }}
                    >
                      <i class="fa-solid fa-id-card text-blue-600"></i>
                      Profile
                    </button>
                  </li>

                  <li>
                    <button
                      class="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                      onclick={() => {
                        changePassword();
                        userOpen = false;
                      }}
                    >
                      <i class="fa-solid fa-key text-blue-600"></i>
                      Change Password
                    </button>
                  </li>

                  <li>
                    <button
                      onclick={() => {
                        logout();
                        userOpen = false;
                      }}
                      class="w-full text-left text-red-600 px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                    >
                      <i class="fa-solid fa-right-from-bracket text-red-600"
                      ></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            {/if}
          </div>
        {/if}
      </nav>

      <!-- Mobile Button -->
      <button onclick={toggleMobileMenu} class="md:hidden text-indigo-600">
        <i class="fa-solid fa-bars text-2xl"></i>
      </button>
    </div>

    <!-- Mobile Nav -->
    {#if mobileMenuOpen}
      <nav class="md:hidden bg-white border-t border-gray-200 shadow-sm">
        <ul class="flex flex-col px-4 py-4 space-y-3 text-gray-700 text-md">
          <li>
            <a
              href="/{user.role}"
              class="flex items-center gap-3 py-2 hover:text-indigo-600"
            >
              <i class="fa-solid fa-book-open text-blue-600"></i>
              Lessons
            </a>
          </li>

          <li>
            <a
              href="/{user.role}/subscriptions"
              class="flex items-center gap-3 py-2 hover:text-indigo-600"
            >
              <i class="fa-solid fa-credit-card text-blue-600"></i>
              Subscriptions
            </a>
          </li>

          <li>
            <a
              href="/{user.role}/upgradepaln"
              class="flex items-center gap-3 py-2 hover:text-indigo-600"
            >
              <i class="fa-solid fa-arrow-up-right-dots text-blue-600"></i>
              Upgrade Plan
            </a>
          </li>

          {#if user}
            <details>
              <summary
                class="cursor-pointer py-2 flex items-center justify-between"
              >
                <span class="flex items-center gap-2">
                  <i class="fa-solid fa-user text-blue-600"></i>
                  {user.name}
                </span>
                <i class="fa-solid fa-chevron-down text-xs text-blue-600 ml-2"
                ></i>
              </summary>

              <ul class="pl-4 mt-2 space-y-1">
                <li>
                  <a
                    href="#"
                    class="flex items-center gap-2 py-1 hover:text-indigo-600"
                  >
                    <i class="fa-solid fa-id-card text-blue-600"></i>
                    Profile
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    class="flex items-center gap-2 py-1 hover:text-indigo-600"
                  >
                    <i class="fa-solid fa-key text-blue-600"></i>
                    Change Password
                  </a>
                </li>

                <li>
                  <button
                    onclick={logout}
                    class="flex items-center gap-2 text-red-600 py-1 hover:text-red-800"
                  >
                    <i class="fa-solid fa-right-from-bracket text-red-600"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </details>
          {/if}
        </ul>
      </nav>
    {/if}
  </header>

  <!-- Main Content -->
  <main class="pt-[88px] pb-10 flex-grow">
    <div class="max-w-7xl mx-auto px-0 sm:px-6 lg:px-0">
      <slot />
    </div>
  </main>

  <!-- Footer -->
  <!-- Footer -->
  <footer
    class="bg-white border-t border-gray-200 text-gray-700 py-6 select-none"
  >
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-md font-medium"
    >
      <p>&copy; 2025 Foxuls Academy. Built for everyone.</p>
    </div>
  </footer>
</div>
