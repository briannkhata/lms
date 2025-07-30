<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";

  let formElement: HTMLFormElement;
  export let data;
  const { gradelevels, subjects, folders } = data;

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

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-2xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Create Lesson
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Fill in the fields to add a new lesson.
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
      <!-- Code / Title / Content Type -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            for="code"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Code <span class="text-red-500">*</span>
          </label>
          <input
            id="code"
            name="code"
            type="text"
            placeholder="e.g. LES123"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Title <span class="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. Introduction to Fractions"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            for="content_type"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Content Type <span class="text-red-500">*</span>
          </label>
          <select
            id="content_type"
            name="content_type"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option disabled selected value="">Select Type</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="pdf">PDF</option>
            <option value="text">Text</option>
          </select>
        </div>
      </div>

      <!-- Folder / Subject / Grade Level -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            for="folder_id"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Folder <span class="text-red-500">*</span>
          </label>
          <select
            id="folder_id"
            name="folder_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option disabled selected value="">Select Folder</option>
            {#each folders as folder}
              <option value={folder.id}>{folder.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label
            for="subject_id"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Subject <span class="text-red-500">*</span>
          </label>
          <select
            id="subject_id"
            name="subject_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option disabled selected value="">Select Subject</option>
            {#each subjects as subject}
              <option value={subject.id}>{subject.name}</option>
            {/each}
          </select>
        </div>

        <div>
          <label
            for="grade_level_id"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Grade Level <span class="text-red-500">*</span>
          </label>
          <select
            id="grade_level_id"
            name="grade_level_id"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option disabled selected value="">Select Grade</option>
            {#each gradelevels as level}
              <option value={level.id}>
                {level.name} | {level.description}
              </option>
            {/each}
          </select>
        </div>
      </div>

      <!-- Description -->
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Description <span class="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          placeholder="e.g. Covers the basics of identifying and working with fractions."
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        ></textarea>
      </div>

      <!-- Cloudinary URL -->
      <div>
        <label
          for="cloudinary_url"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Cloudinary URL <span class="text-red-500">*</span>
        </label>
        <input
          id="cloudinary_url"
          name="cloudinary_url"
          type="text"
          placeholder="https://res.cloudinary.com/..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Submit -->
      <div class="text-left">
        <button
          type="submit"
          class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        >
          <i class="fa-solid fa-plus text-sm"></i>
          Add
        </button>
      </div>
    </form>
  </div>
</div>
