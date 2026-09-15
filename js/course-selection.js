const SELECTED_COURSES_KEY = "selectedCourses";
const CURRENT_SEMESTER_KEY = "currentSemester";

let selectedCourseId = null;

/* =========================
   Local Storage
========================= */

function getSelectedCourses() {
  try {
    return JSON.parse(localStorage.getItem(SELECTED_COURSES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveSelectedCourses(selectedCourses) {
  localStorage.setItem(SELECTED_COURSES_KEY, JSON.stringify(selectedCourses));
}

function getPassedCourses() {
  try {
    return JSON.parse(localStorage.getItem("passedCourses")) || [];
  } catch {
    return [];
  }
}

function getCurrentSemester() {
  return Number(localStorage.getItem(CURRENT_SEMESTER_KEY)) || 1;
}

/* =========================
   Course Status
========================= */

function isCoursePassed(courseName) {
  const passedCourses = getPassedCourses();

  return passedCourses.some((id) => {
    const course = courses.find((item) => Number(item.id) === Number(id));

    return course && course.name === courseName;
  });
}

function isCourseSelected(courseName) {
  const selectedCourses = getSelectedCourses();

  return selectedCourses.some((item) => {
    const course = courses.find(
      (course) => Number(course.id) === Number(item.courseId),
    );

    return course && course.name === courseName;
  });
}

function getPassedUnits() {
  const passedCourses = getPassedCourses();

  return passedCourses.reduce((total, id) => {
    const course = courses.find((item) => Number(item.id) === Number(id));

    if (!course) {
      return total;
    }

    return total + Number(course.units);
  }, 0);
}

/* =========================
   Prerequisites
========================= */

function checkPrerequisites(course) {
  if (!course.prerequisite || course.prerequisite.length === 0) {
    return {
      allowed: true,
      message: "",
    };
  }

  const missing = course.prerequisite.filter((prerequisite) => {
    const passed = isCoursePassed(prerequisite);

    const selected = isCourseSelected(prerequisite);

    return !passed && !selected;
  });

  if (missing.length === 0) {
    return {
      allowed: true,
      message: "",
    };
  }

  return {
    allowed: false,
    message:
      `برای انتخاب «${course.name}» ابتدا باید ` +
      `${missing.join("، ")} ` +
      `را پاس کرده باشید یا در همین ترم انتخاب کنید.`,
  };
}

/* =========================
   Corequisites
========================= */

function checkCorequisites(course) {
  if (!course.corequisite || course.corequisite.length === 0) {
    return {
      allowed: true,
      message: "",
    };
  }

  const missing = course.corequisite.filter((corequisite) => {
    const passed = isCoursePassed(corequisite);

    const selected = isCourseSelected(corequisite);

    return !passed && !selected;
  });

  if (missing.length === 0) {
    return {
      allowed: true,
      message: "",
    };
  }

  return {
    allowed: false,
    message:
      `درس «${course.name}» هم‌نیاز ` +
      `${missing.join("، ")} دارد و باید قبلاً ` +
      `پاس شده باشد یا همزمان انتخاب شود.`,
  };
}

/* =========================
   Conditions
========================= */

function checkCourseCondition(course) {
  if (!course.condition) {
    return {
      allowed: true,
      message: "",
    };
  }

  if (course.condition.type === "passedUnits") {
    const passedUnits = getPassedUnits();

    if (passedUnits >= Number(course.condition.value)) {
      return {
        allowed: true,
        message: "",
      };
    }

    return {
      allowed: false,
      message:
        `برای انتخاب «${course.name}» باید حداقل ` +
        `${course.condition.value} واحد را پاس کرده باشید. ` +
        `واحدهای پاس‌شده فعلی شما: ${passedUnits}`,
    };
  }

  if (course.condition.type === "semester") {
    const currentSemester = getCurrentSemester();

    if (currentSemester >= Number(course.condition.value)) {
      return {
        allowed: true,
        message: "",
      };
    }

    return {
      allowed: false,
      message:
        `درس «${course.name}» از ترم ` +
        `${course.condition.value} به بعد قابل انتخاب است. ` +
        `ترم فعلی شما: ${currentSemester}`,
    };
  }

  return {
    allowed: true,
    message: "",
  };
}

/* =========================
   Full Validation
========================= */

function validateCourseSelection(course) {
  const prerequisiteResult = checkPrerequisites(course);

  if (!prerequisiteResult.allowed) {
    return prerequisiteResult;
  }

  const corequisiteResult = checkCorequisites(course);

  if (!corequisiteResult.allowed) {
    return corequisiteResult;
  }

  const conditionResult = checkCourseCondition(course);

  if (!conditionResult.allowed) {
    return conditionResult;
  }

  return {
    allowed: true,
    message: "",
  };
}

/* =========================
   Modal
========================= */

function openAddCourseModal() {
  const modal = document.getElementById("addCourseModal");

  if (!modal) return;

  modal.classList.add("active");

  resetCourseForm();
}

function closeAddCourseModal() {
  const modal = document.getElementById("addCourseModal");

  if (!modal) return;

  modal.classList.remove("active");

  resetCourseForm();
}

function resetCourseForm() {
  selectedCourseId = null;

  const searchInput = document.getElementById("courseSearch");

  const searchResults = document.getElementById("courseSearchResults");

  const selectedForm = document.getElementById("selectedCourseForm");

  const selectedName = document.getElementById("selectedCourseName");

  const courseCode = document.getElementById("courseCode");

  const groupCode = document.getElementById("groupCode");

  const teacherName = document.getElementById("teacherName");

  const courseDay = document.getElementById("courseDay");

  const startTime = document.getElementById("courseStartTime");

  const endTime = document.getElementById("courseEndTime");

  if (searchInput) {
    searchInput.value = "";
  }

  if (searchResults) {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
  }

  if (selectedForm) {
    selectedForm.classList.remove("active");
  }

  if (selectedName) {
    selectedName.textContent = "-";
  }

  if (courseCode) {
    courseCode.value = "";
  }

  if (groupCode) {
    groupCode.value = "";
  }

  if (teacherName) {
    teacherName.value = "";
  }

  if (courseDay) {
    courseDay.value = "";
  }

  if (startTime) {
    startTime.value = "";
  }

  if (endTime) {
    endTime.value = "";
  }
}

/* =========================
   Search Courses
========================= */

function searchCourses() {
  const typeSelect = document.getElementById("courseType");

  const searchInput = document.getElementById("courseSearch");

  const results = document.getElementById("courseSearchResults");

  if (!typeSelect || !searchInput || !results) {
    return;
  }

  const selectedType = typeSelect.value;

  const query = searchInput.value.trim().toLowerCase();

  results.innerHTML = "";

  if (!selectedType || !query) {
    results.style.display = "none";
    return;
  }

  const matchedCourses = courses.filter((course) => {
    return (
      course.type === selectedType && course.name.toLowerCase().includes(query)
    );
  });

  results.style.display = "block";

  if (matchedCourses.length === 0) {
    results.innerHTML = `
      <div class="search-empty">
        درسی با این مشخصات پیدا نشد.
      </div>
    `;

    return;
  }

  matchedCourses.forEach((course) => {
    const passed = isCoursePassed(course.name);
    const selected = isCourseSelected(course.name);

    const result = document.createElement("div");

    result.className = "course-result";

    if (passed || selected) {
      result.classList.add("disabled");
    }

    result.innerHTML = `
      <div>
        <strong>${course.name}</strong>

        <span>
          ${course.units} واحد
          ·
          ${course.code ? `کد: ${course.code}` : "کد درس ثبت نشده"}
        </span>
      </div>

      ${
        passed
          ? `<span class="passed-badge">پاس شده</span>`
          : selected
            ? `<span class="selected-badge">انتخاب شده</span>`
            : ""
      }
    `;

    if (!passed && !selected) {
      result.addEventListener("click", () => {
        selectCourse(course.id);
      });
    }

    results.appendChild(result);
  });
}

/* =========================
   Select Course
========================= */

function selectCourse(courseId) {
  const course = courses.find((item) => Number(item.id) === Number(courseId));

  if (!course) {
    alert("درس مورد نظر پیدا نشد.");
    return;
  }

  const validation = validateCourseSelection(course);

  if (!validation.allowed) {
    alert(validation.message);
    return;
  }

  selectedCourseId = course.id;

  const selectedCourseName = document.getElementById("selectedCourseName");

  const courseCode = document.getElementById("courseCode");

  const groupCode = document.getElementById("groupCode");

  const selectedForm = document.getElementById("selectedCourseForm");

  if (selectedCourseName) {
    selectedCourseName.textContent = course.name;
  }

  if (courseCode) {
    courseCode.value = course.code || "";
  }

  if (groupCode) {
    groupCode.value = "";
  }

  if (selectedForm) {
    selectedForm.classList.add("active");
  }

  const results = document.getElementById("courseSearchResults");

  if (results) {
    results.style.display = "none";
  }
}

/* =========================
   Add Selected Course
========================= */

function addSelectedCourse() {
  if (!selectedCourseId) {
    alert("ابتدا یک درس را انتخاب کنید.");
    return;
  }

  const courseCode = document.getElementById("courseCode").value.trim();

  const groupCode = document.getElementById("groupCode").value.trim();

  const teacher = document.getElementById("teacherName").value.trim();

  const day = document.getElementById("courseDay").value;

  const startTime = document.getElementById("courseStartTime").value;

  const endTime = document.getElementById("courseEndTime").value;

  if (!courseCode) {
    alert("کد درس را وارد کنید.");
    return;
  }

  if (!groupCode) {
    alert("کد گروه را وارد کنید.");
    return;
  }

  if (!teacher) {
    alert("نام استاد را وارد کنید.");
    return;
  }

  if (!day) {
    alert("روز کلاس را انتخاب کنید.");
    return;
  }

  if (!startTime) {
    alert("ساعت شروع کلاس را انتخاب کنید.");
    return;
  }

  if (!endTime) {
    alert("ساعت پایان کلاس را انتخاب کنید.");
    return;
  }

  if (startTime >= endTime) {
    alert("ساعت پایان باید بعد از ساعت شروع باشد.");
    return;
  }

  const selectedCourses = getSelectedCourses();

  const alreadySelected = selectedCourses.some(
    (item) => Number(item.courseId) === Number(selectedCourseId),
  );

  if (alreadySelected) {
    alert("این درس قبلاً انتخاب شده است.");
    return;
  }

  const course = courses.find(
    (item) => Number(item.id) === Number(selectedCourseId),
  );

  if (!course) {
    alert("درس مورد نظر پیدا نشد.");
    return;
  }

  const validation = validateCourseSelection(course);

  if (!validation.allowed) {
    alert(validation.message);
    return;
  }

  const time = `${day} | ${startTime} تا ${endTime}`;

  selectedCourses.push({
    courseId: course.id,

    courseCode: courseCode,

    groupCode: groupCode,

    teacher: teacher,

    day: day,

    startTime: startTime,

    endTime: endTime,

    time: time,
  });

  saveSelectedCourses(selectedCourses);

  renderSelectedCourses();

  closeAddCourseModal();
}

/* =========================
   Remove Selected Course
========================= */

function removeSelectedCourse(courseId) {
  const confirmed = confirm("آیا از حذف این درس مطمئن هستید؟");

  if (!confirmed) {
    return;
  }

  const selectedCourses = getSelectedCourses();

  const updatedCourses = selectedCourses.filter(
    (item) => Number(item.courseId) !== Number(courseId),
  );

  saveSelectedCourses(updatedCourses);

  renderSelectedCourses();
}

/* =========================
   Render Selected Courses
========================= */

function renderSelectedCourses() {
  const tableBody = document.querySelector("#selectedCoursesTable tbody");

  const countElement = document.getElementById("selectedCoursesCount");

  const unitsElement = document.getElementById("selectedUnits");

  if (!tableBody) {
    return;
  }

  const selectedCourses = getSelectedCourses();

  tableBody.innerHTML = "";

  if (selectedCourses.length === 0) {
    tableBody.innerHTML = `
      <tr class="empty-schedule-row">
        <td colspan="8">
          هنوز درسی برای این ترم انتخاب نشده است.
        </td>
      </tr>
    `;

    if (countElement) {
      countElement.textContent = "0";
    }

    if (unitsElement) {
      unitsElement.textContent = "0";
    }

    return;
  }

  let totalUnits = 0;

  selectedCourses.forEach((selectedCourse, index) => {
    const course = courses.find(
      (item) => Number(item.id) === Number(selectedCourse.courseId),
    );

    if (!course) {
      return;
    }

    totalUnits += Number(course.units);

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
          ${index + 1}
        </td>

        <td>
          ${course.name}
        </td>

        <td>
          ${selectedCourse.courseCode || course.code || "بدون کد"}
        </td>

        <td>
          ${selectedCourse.groupCode || "بدون کد گروه"}
        </td>

        <td>
          ${course.units}
        </td>

        <td>
          ${selectedCourse.teacher}
        </td>

        <td>
          ${selectedCourse.time}
        </td>

        <td>
          <button
            type="button"
            class="remove-course-button"
            data-course-id="${course.id}"
          >
            حذف
          </button>
        </td>
      `;

    const removeButton = row.querySelector(".remove-course-button");

    removeButton.addEventListener("click", () =>
      removeSelectedCourse(course.id),
    );

    tableBody.appendChild(row);
  });

  if (countElement) {
    countElement.textContent = selectedCourses.length;
  }

  if (unitsElement) {
    unitsElement.textContent = totalUnits;
  }
}

/* =========================
   Current Semester
========================= */

function setCurrentSemester(semester) {
  const value = Number(semester);

  if (!Number.isInteger(value) || value < 1) {
    return;
  }

  localStorage.setItem(CURRENT_SEMESTER_KEY, String(value));
}

/* =========================
   Initialize
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("openAddCourse");

  const closeButton = document.getElementById("closeAddCourse");

  const confirmButton = document.getElementById("confirmAddCourse");

  const modal = document.getElementById("addCourseModal");

  const searchInput = document.getElementById("courseSearch");

  const typeSelect = document.getElementById("courseType");

  if (openButton) {
    openButton.addEventListener("click", openAddCourseModal);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeAddCourseModal);
  }

  if (confirmButton) {
    confirmButton.addEventListener("click", addSelectedCourse);
  }

  if (searchInput) {
    searchInput.addEventListener("input", searchCourses);
  }

  if (typeSelect) {
    typeSelect.addEventListener("change", searchCourses);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeAddCourseModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAddCourseModal();
    }
  });

  renderSelectedCourses();
});
