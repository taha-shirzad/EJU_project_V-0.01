const STORAGE_KEY = "passedCourses";

function getPassedCourses() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function savePassedCourses(passedCourses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passedCourses));
}

function togglePassedCourse(courseId, isPassed) {
  let passedCourses = getPassedCourses();

  if (isPassed) {
    if (!passedCourses.includes(courseId)) {
      passedCourses.push(courseId);
    }
  } else {
    passedCourses = passedCourses.filter((id) => id !== courseId);
  }

  savePassedCourses(passedCourses);

  updatePassedCount();
}

function createCourseElement(course, passedCourses) {
  const isPassed = passedCourses.includes(course.id);

  const item = document.createElement("div");

  item.className = `course-item ${isPassed ? "is-passed" : ""}`;

  item.innerHTML = `
    <label class="course-checkbox">
      <input
        type="checkbox"
        data-course-id="${course.id}"
        ${isPassed ? "checked" : ""}
      >
      <span class="checkmark"></span>
    </label>

    <div class="course-info">
      <div class="course-name">${course.name}</div>

      <div class="course-meta">
        <span>${course.units} واحد</span>

        ${
          course.code
            ? `<span class="course-code">
                کد: ${course.code}
              </span>`
            : `<span>
                کد: وارد نشده
              </span>`
        }

        ${
          course.prerequisiteText
            ? `<span>
                پیش‌نیاز: ${course.prerequisiteText}
              </span>`
            : ""
        }
      </div>
    </div>
  `;

  const checkbox = item.querySelector("input");

  checkbox.addEventListener("change", () => {
    item.classList.toggle("is-passed", checkbox.checked);

    togglePassedCourse(course.id, checkbox.checked);

    applyCourseSearch();
  });

  return item;
}

function renderCourses(searchQuery = "") {
  const container = document.getElementById("courseSections");

  if (!container) return;

  const passedCourses = getPassedCourses();

  const types = ["تخصصی", "مهارت عمومی", "عمومی", "پایه", "اختیاری"];

  const query = searchQuery.trim().toLowerCase();

  container.innerHTML = "";

  types.forEach((type) => {
    let typeCourses = courses.filter((course) => course.type === type);

    if (query) {
      typeCourses = typeCourses.filter((course) =>
        course.name.toLowerCase().includes(query),
      );
    }

    if (typeCourses.length === 0) return;

    const section = document.createElement("section");

    section.className = "course-section";

    section.innerHTML = `
      <div class="course-section-header">
        <h2>دروس ${type}</h2>
        <span>${typeCourses.length} درس</span>
      </div>

      <div class="course-list"></div>
    `;

    const list = section.querySelector(".course-list");

    typeCourses.forEach((course) => {
      list.appendChild(createCourseElement(course, passedCourses));
    });

    container.appendChild(section);
  });

  if (container.children.length === 0 && query) {
    container.innerHTML = `
      <div class="search-empty">
        درسی با این نام پیدا نشد.
      </div>
    `;
  }

  updatePassedCount();
}

function updatePassedCount() {
  const counter = document.getElementById("passedCount");

  if (!counter) return;

  const passedCourses = getPassedCourses();

  counter.textContent = passedCourses.length;
}

function applyCourseSearch() {
  const searchInput = document.getElementById("passedCourseSearch");

  if (!searchInput) return;

  renderCourses(searchInput.value);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCourses();

  const searchInput = document.getElementById("passedCourseSearch");

  if (searchInput) {
    searchInput.addEventListener("input", applyCourseSearch);
  }
});
