<script lang="ts">
  let { data } = $props();
  const { lesson } = data;
</script>

<section
  class="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 bg-gray-50 min-h-[80vh]"
>
  <div
    class="bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
  >
    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-8 py-6 border-b border-gray-200"
    >
      <h1
        class="text-4xl font-extrabold text-gray-900 tracking-tight select-none"
      >
        Lesson Details
      </h1>
      <a
        href="/admin/lessons/"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        <i class="fa-solid fa-arrow-left"></i> Back
      </a>
    </header>

    <main class="grid grid-cols-1 md:grid-cols-3 gap-10 p-8">
      <!-- Info Panel -->
      <section class="col-span-2 space-y-6">
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-800">Code</h2>
          <p class="text-gray-700">{lesson?.code ?? "N/A"}</p>
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-800">Title</h2>
          <p class="text-gray-700">{lesson?.title ?? "N/A"}</p>
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-800">Content Type</h2>
          <p class="capitalize text-gray-700">
            {lesson?.content_type ?? "N/A"}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-800">Description</h2>
          <p class="text-gray-700 whitespace-pre-line">
            {lesson?.description ?? "N/A"}
          </p>
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-800">Subject</h2>
          <p class="text-gray-700">{lesson?.subject?.name ?? "N/A"}</p>
        </div>
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-800">Grade Level</h2>
          <p class="text-gray-700">{lesson?.gradelevel?.name ?? "N/A"}</p>
        </div>
      </section>

      <!-- Media Panel -->
      <section
        class="bg-gray-100 rounded-xl p-6 flex flex-col items-center justify-center"
      >
        <h3 class="text-2xl font-semibold mb-6 text-gray-800">Media Preview</h3>
        {#if lesson?.cloudinary_url}
          <video
            controls
            class="w-full rounded-lg shadow-lg aspect-video border border-gray-300"
            src={lesson.cloudinary_url}
            aria-label="Lesson media preview"
          >
            Your browser does not support the video tag.
          </video>
        {:else}
          <div class="text-center text-gray-500 italic">
            No media available for this lesson.
          </div>
        {/if}
      </section>
    </main>
  </div>
</section>
