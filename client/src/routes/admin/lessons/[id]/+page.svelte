<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let formElement: HTMLFormElement;
  let { data } = $props();

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
        } else {
          toast.push(data?.message, {
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

        setTimeout(() => {
          goto("/admin/lessons");
        }, 1000);
      }
    };
  }
</script>

<div class="pt-16 pb-10 px-4 md:px-6 max-w-screen-2xl mx-auto">
  <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 select-none">
        Update Lesson
      </h2>
      <p class="text-sm text-gray-500 mt-1">
        Modify the fields below to update the lesson.
      </p>
      <hr class="mt-5 border-t border-gray-200" />
    </div>

    {#if data.lesson}
      <form
        method="POST"
        use:enhance={handleSubmit}
        bind:this={formElement}
        class="space-y-8"
      >
        <!-- Hidden ID -->
        <input type="hidden" name="id" id="id" bind:value={data.lesson.id} />

        <!-- Code, Title, Content Type -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              for="code"
              class="block text-sm font-medium text-gray-700 mb-2">Code *</label
            >
            <input
              id="code"
              name="code"
              type="text"
              bind:value={data.lesson.code}
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              for="title"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Title *</label
            >
            <input
              id="title"
              name="title"
              type="text"
              bind:value={data.lesson.title}
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              for="content_type"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Content Type *</label
            >
            <select
              id="content_type"
              name="content_type"
              bind:value={data.lesson.content_type}
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option disabled value="">Select Type</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="pdf">PDF</option>
              <option value="text">Text</option>
            </select>
          </div>
        </div>

        <!-- Folder, Subject, Grade Level -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label
              for="folder_id"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Folder *</label
            >
            <select
              id="folder_id"
              name="folder_id"
              bind:value={data.lesson.folder_id}
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option disabled value="">Select Folder</option>
              {#each Array.isArray(data.folders) ? data.folders : [data.folders] as folder}
                <option value={folder.id}>{folder.name}</option>
              {/each}
            </select>
          </div>

          <div>
            <label
              for="subject_id"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Subject *</label
            >
            <select
              id="subject_id"
              name="subject_id"
              bind:value={data.lesson.subject_id}
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option disabled value="">Select Subject</option>
              {#each Array.isArray(data.subjects) ? data.subjects : [data.subjects] as subject}
                <option value={subject.id}>{subject.name}</option>
              {/each}
            </select>
          </div>

          <div>
            <label
              for="grade_level_id"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Grade Level *</label
            >
            <select
              id="grade_level_id"
              name="grade_level_id"
              bind:value={data.lesson.grade_level_id}
              class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option disabled value="">Select Grade</option>
              {#each Array.isArray(data.gradelevels) ? data.gradelevels : [data.gradelevels] as level}
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
            >Description *</label
          >
          <textarea
            id="description"
            name="description"
            bind:value={data.lesson.description}
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <!-- Cloudinary URL -->
        <div>
          <label
            for="cloudinary_url"
            class="block text-sm font-medium text-gray-700 mb-2"
            >Cloudinary URL *</label
          >
          <input
            id="cloudinary_url"
            name="cloudinary_url"
            type="text"
            bind:value={data.lesson.cloudinary_url}
            class="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <!-- Submit -->
        <div class="text-left">
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            <i class="fa-solid fa-floppy-disk text-sm"></i>
            Update
          </button>
        </div>
      </form>
    {:else}
      <p class="text-red-600 text-sm">Lesson Not Found.</p>
    {/if}
  </div>
</div>
