<script lang="ts">
  import LoginForm from "./LoginForm.svelte";
  import RegisterForm from "./RegisterForm.svelte";
  export let data: any;

  import { writable } from "svelte/store";
  const showLoginModal = writable(false);
  const showRegisterModal = writable(false);
  let mobileMenuVisible = false;
  let formData: HTMLFormElement;

  function openLogin() {
    showLoginModal.set(true);
  }

  function openRegister() {
    showRegisterModal.set(true);
  }

  function toggleMobileMenu() {
    mobileMenuVisible = !mobileMenuVisible;
  }
</script>

<header
  class="bg-white border-b border-blue-300 fixed w-full top-0 left-0 z-50 shadow-md"
>
  <div class="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
    <!-- Logo & Brand -->
    <a href="/" class="flex flex-col select-none group max-w-max">
      <span
        class="text-3xl font-extrabold text-blue-800 leading-tight tracking-wide drop-shadow-sm transition-transform duration-300 ease-in-out group-hover:scale-105"
      >
        Foxuls<span class="align-super text-sm ml-1 text-blue-500">&trade;</span
        >
      </span>
      <span
        class="text-xs text-gray-500 tracking-widest uppercase font-semibold group-hover:text-gray-700 transition-colors duration-300"
      >
        Academy
      </span>
    </a>

    <!-- Desktop Navigation -->
    <nav
      class="hidden md:flex items-center space-x-4 text-blue-800 font-semibold tracking-wide"
    >
      <!-- Navigation Links -->
      <a href="#lessons" class="relative group px-1 py-2">
        <span class="hover:text-blue-900 transition-colors duration-300">
          Lessons
        </span>
        <span
          class="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-700 transition-all duration-300 group-hover:w-full rounded"
        ></span>
      </a>

      <a href="#why" class="relative group px-1 py-2">
        <span class="hover:text-blue-900 transition-colors duration-300">
          Why Us
        </span>
        <span
          class="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-700 transition-all duration-300 group-hover:w-full rounded"
        ></span>
      </a>

      <a href="#about" class="relative group px-1 py-2">
        <span class="hover:text-blue-900 transition-colors duration-300">
          About
        </span>
        <span
          class="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-700 transition-all duration-300 group-hover:w-full rounded"
        ></span>
      </a>

      <a href="#contact" class="relative group px-1 py-2">
        <span class="hover:text-blue-900 transition-colors duration-300">
          Contact
        </span>
        <span
          class="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-700 transition-all duration-300 group-hover:w-full rounded"
        ></span>
      </a>
    </nav>

    <!-- Auth Buttons & Mobile Menu Button -->
    <div class="flex items-center space-x-4">
      <div class="hidden md:flex space-x-4">
        <button
          type="button"
          onclick={openLogin}
          class="flex items-center gap-2 px-6 py-2 rounded-md border border-blue-600 text-blue-700 font-semibold tracking-wide shadow-sm hover:bg-blue-50 hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          <i class="fa-solid fa-right-to-bracket"></i>
          Login
        </button>

        <button
          type="button"
          onclick={openRegister}
          class="flex items-center gap-2 px-6 py-2 rounded-md border border-blue-600 text-blue-700 font-semibold tracking-wide shadow-sm hover:bg-blue-50 hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          <i class="fa-solid fa-user-plus"></i>
          Register
        </button>
      </div>

      <!-- Mobile menu button -->
      <button
        onclick={toggleMobileMenu}
        class="md:hidden text-blue-700 focus:outline-none p-2 rounded hover:bg-blue-100 transition-colors"
        aria-label="Toggle navigation menu"
      >
        <svg
          class="w-7 h-7"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Navigation -->
  {#if mobileMenuVisible}
    <div
      class="md:hidden bg-white shadow-md border-t border-blue-100 animate-slide-down w-full"
    >
      <nav
        class="flex flex-col gap-3 px-6 py-5 text-blue-800 font-semibold tracking-wide"
      >
        <!-- Navigation Links (No Icons) -->
        <a
          href="#lessons"
          class="py-2 px-2 rounded hover:bg-blue-50 hover:text-blue-900 transition"
        >
          Lessons
        </a>
        <a
          href="#why"
          class="py-2 px-2 rounded hover:bg-blue-50 hover:text-blue-900 transition"
        >
          Why Us
        </a>
        <a
          href="#about"
          class="py-2 px-2 rounded hover:bg-blue-50 hover:text-blue-900 transition"
        >
          About
        </a>
        <a
          href="#contact"
          class="py-2 px-2 rounded hover:bg-blue-50 hover:text-blue-900 transition"
        >
          Contact
        </a>

        <hr class="my-3 border-blue-200" />

        <!-- Buttons with Icons -->
        <button
          type="button"
          onclick={openLogin}
          class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold transition"
        >
          <i class="fa-solid fa-right-to-bracket"></i>
          Login
        </button>

        <button
          type="button"
          onclick={openRegister}
          class="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold transition"
        >
          <i class="fa-solid fa-user-plus"></i>
          Register
        </button>
      </nav>
    </div>
  {/if}
</header>

<!-- Spacer to offset fixed header -->
<div class="h-16"></div>

<!-- Login Modal -->
<LoginForm form={formData} bind:showLoginModal={$showLoginModal} />
<RegisterForm
  form={formData}
  bind:showRegisterModal={$showRegisterModal}
  gradelevels={data.gradelevels}
/>
