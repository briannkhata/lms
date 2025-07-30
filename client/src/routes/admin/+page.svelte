<script lang="ts">
  export let data;
  const {
    gradeLevels,
    plans,
    students,
    teachers,
    lessons,
    subjects,
    subscriptions,
    expiredsubscriptions,
    expiringsubscriptions,
    loggedinStudents,
  } = data;

  const gradeLevelCount = Array.isArray(gradeLevels) ? gradeLevels.length : 0;
  const planCount = Array.isArray(plans) ? plans.length : 0;
  const studentCount = Array.isArray(students)
    ? students.length
    : students
      ? 1
      : 0;
  const teacherCount = Array.isArray(teachers)
    ? teachers.length
    : teachers
      ? 1
      : 0;
  const lessonCount = Array.isArray(lessons) ? lessons.length : 0;
  const subjectCount = Array.isArray(subjects) ? subjects.length : 0;
  const subscriptionsCount = Array.isArray(subscriptions)
    ? subscriptions.length
    : subscriptions
      ? 1
      : 0;
  const expiredsubscriptionsCount = Array.isArray(expiredsubscriptions)
    ? expiredsubscriptions.length
    : expiredsubscriptions
      ? 1
      : 0;
  const expiringsubscriptionsCount = Array.isArray(expiringsubscriptions)
    ? expiringsubscriptions.length
    : expiringsubscriptions
      ? 1
      : 0;
  const loggedinStudentsCount = Array.isArray(loggedinStudents)
    ? loggedinStudents.length
    : loggedinStudents
      ? 1
      : 0;
</script>

<main class="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-10">
  <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 select-none">
    Dashboard
  </h1>

  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
  >
    <!-- Subjects -->
    <div
      class="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition duration-300 cursor-default"
      tabindex="0"
      aria-label="Subjects: {subjectCount}"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2 select-none"
      >
        <i class="fa-solid fa-book-open text-indigo-500" aria-hidden="true"></i>
        Subjects
      </h2>
      <p
        class="text-gray-900 text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
      >
        {subjectCount}
      </p>
      <p class="text-gray-600 text-base leading-relaxed">
        Manage subjects and organize topics.
      </p>
    </div>

    <!-- Teachers -->
    <div
      class="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition duration-300 cursor-default"
      tabindex="0"
      aria-label="Teachers: {teacherCount}"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2 select-none"
      >
        <i
          class="fa-solid fa-chalkboard-user text-indigo-500"
          aria-hidden="true"
        ></i> Teachers
      </h2>
      <p
        class="text-gray-900 text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
      >
        {teacherCount}
      </p>
      <p class="text-gray-600 text-base leading-relaxed">
        Add and manage teacher accounts.
      </p>
    </div>

    <!-- Students -->
    <div
      class="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition duration-300 cursor-default"
      tabindex="0"
      aria-label="Students: {studentCount}"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2 select-none"
      >
        <i class="fa-solid fa-user-graduate text-indigo-500" aria-hidden="true"
        ></i> Students
      </h2>
      <p
        class="text-gray-900 text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
      >
        {studentCount}
      </p>
      <p class="text-gray-600 text-base leading-relaxed">
        View, add, or remove students from classes.
      </p>
    </div>

    <!-- Lessons -->
    <div
      class="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition duration-300 cursor-default"
      tabindex="0"
      aria-label="Lessons: {lessonCount}"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2 select-none"
      >
        <i class="fa-solid fa-video text-indigo-500" aria-hidden="true"></i> Lessons
      </h2>
      <p
        class="text-gray-900 text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
      >
        {lessonCount}
      </p>
      <p class="text-gray-600 text-base leading-relaxed">
        Add and organize lessons.
      </p>
    </div>

    <!-- Grade Levels -->
    <div
      class="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition duration-300 cursor-default"
      tabindex="0"
      aria-label="Grade Levels: {gradeLevelCount}"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2 select-none"
      >
        <i class="fa-solid fa-layer-group text-indigo-500" aria-hidden="true"
        ></i> Grade Levels
      </h2>
      <p
        class="text-gray-900 text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
      >
        {gradeLevelCount}
      </p>
      <p class="text-gray-600 text-base leading-relaxed">All grade levels</p>
    </div>

    <!-- Subscriptions -->
    <div
      class="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition duration-300 cursor-default"
      tabindex="0"
      aria-label="Subscriptions: {subscriptionsCount}"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2 select-none"
      >
        <i class="fa-solid fa-credit-card text-indigo-500" aria-hidden="true"
        ></i> Subscriptions
      </h2>
      <p
        class="text-gray-900 text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
      >
        {subscriptionsCount}
      </p>
      <p class="text-gray-600 text-base leading-relaxed">
        All active subscriptions
      </p>
    </div>

    <!-- Expiring Subscriptions -->
    <div
      class="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition duration-300 cursor-default"
      tabindex="0"
      aria-label="Expiring Subscriptions: {expiringsubscriptionsCount}"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2 select-none"
      >
        <i
          class="fa-solid fa-clock-rotate-left text-indigo-500"
          aria-hidden="true"
        ></i> Expiring Subscriptions
      </h2>
      <p
        class="text-gray-900 text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
      >
        {expiringsubscriptionsCount}
      </p>
      <p class="text-gray-600 text-base leading-relaxed">
        Expiring in two days
      </p>
    </div>

    <!-- Expired Subscriptions -->
    <div
      class="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition duration-300 cursor-default"
      tabindex="0"
      aria-label="Expired Subscriptions: {expiredsubscriptionsCount}"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2 select-none"
      >
        <i class="fa-solid fa-clock text-indigo-500" aria-hidden="true"></i> Expired
        Subscriptions
      </h2>
      <p
        class="text-gray-900 text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
      >
        {expiredsubscriptionsCount}
      </p>
      <p class="text-gray-600 text-base leading-relaxed">
        All expired subscriptions
      </p>
    </div>

    <!-- Current Logins -->
    <div
      class="bg-white p-6 rounded-md shadow-lg hover:shadow-xl transition duration-300 cursor-default"
      tabindex="0"
      aria-label="Current Logins: {loggedinStudentsCount}"
    >
      <h2
        class="text-lg sm:text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2 select-none"
      >
        <i
          class="fa-solid fa-right-to-bracket text-indigo-500"
          aria-hidden="true"
        ></i> Current Logins
      </h2>
      <p
        class="text-gray-900 text-2xl sm:text-3xl font-bold tabular-nums leading-tight"
      >
        {loggedinStudentsCount}
      </p>
      <p class="text-gray-600 text-base leading-relaxed">
        Current logged-in students
      </p>
    </div>
  </div>
</main>
