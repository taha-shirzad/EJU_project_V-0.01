const SELECTED_COURSES_KEY = "selectedCourses";
const CURRENT_SEMESTER_KEY = "currentSemester";

let selectedCourseId = null;
let editingCourseId = null;

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

  if (!modal) {
    return;
  }

  modal.classList.add("active");

  resetCourseForm();

  const title = modal.querySelector(".modal-header h2");

  const confirmButton = document.getElementById("confirmAddCourse");

  if (title) {
    title.textContent = "اضافه کردن درس";
  }

  if (confirmButton) {
    confirmButton.textContent = "اضافه کردن به انتخاب واحد";
  }
}

function closeAddCourseModal() {
  const modal = document.getElementById("addCourseModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("active");

  resetCourseForm();
}

function resetCourseForm() {
  selectedCourseId = null;
  editingCourseId = null;

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
    selectedForm.classList.remove("show");
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

    const selected =
      isCourseSelected(course.name) &&
      Number(course.id) !== Number(editingCourseId);

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
    selectedForm.classList.add("show");
  }

  const results = document.getElementById("courseSearchResults");

  if (results) {
    results.style.display = "none";
  }
}

/* =========================
   Add / Edit Selected Course
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

  if (editingCourseId !== null) {
    const index = selectedCourses.findIndex(
      (item) => Number(item.courseId) === Number(editingCourseId),
    );

    if (index === -1) {
      alert("درس مورد نظر برای ویرایش پیدا نشد.");
      return;
    }

    const duplicate = selectedCourses.some(
      (item, itemIndex) =>
        itemIndex !== index &&
        Number(item.courseId) === Number(selectedCourseId),
    );

    if (duplicate) {
      alert("این درس قبلاً انتخاب شده است.");
      return;
    }

    selectedCourses[index] = {
      ...selectedCourses[index],

      courseId: course.id,

      courseCode: courseCode,

      groupCode: groupCode,

      teacher: teacher,

      day: day,

      startTime: startTime,

      endTime: endTime,

      time: time,
    };
  } else {
    const alreadySelected = selectedCourses.some(
      (item) => Number(item.courseId) === Number(selectedCourseId),
    );

    if (alreadySelected) {
      alert("این درس قبلاً انتخاب شده است.");
      return;
    }

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
  }

  saveSelectedCourses(selectedCourses);

  renderSelectedCourses();

  closeAddCourseModal();
}

/* =========================
   Edit Selected Course
========================= */

function editSelectedCourse(courseId) {
  const selectedCourses = getSelectedCourses();

  const selectedCourse = selectedCourses.find(
    (item) => Number(item.courseId) === Number(courseId),
  );

  if (!selectedCourse) {
    alert("اطلاعات درس پیدا نشد.");
    return;
  }

  const course = courses.find((item) => Number(item.id) === Number(courseId));

  if (!course) {
    alert("درس مورد نظر پیدا نشد.");
    return;
  }

  const modal = document.getElementById("addCourseModal");

  const typeSelect = document.getElementById("courseType");

  const searchInput = document.getElementById("courseSearch");

  const selectedName = document.getElementById("selectedCourseName");

  const courseCode = document.getElementById("courseCode");

  const groupCode = document.getElementById("groupCode");

  const teacherName = document.getElementById("teacherName");

  const courseDay = document.getElementById("courseDay");

  const startTime = document.getElementById("courseStartTime");

  const endTime = document.getElementById("courseEndTime");

  const selectedForm = document.getElementById("selectedCourseForm");

  const title = modal?.querySelector(".modal-header h2");

  const confirmButton = document.getElementById("confirmAddCourse");

  editingCourseId = course.id;

  selectedCourseId = course.id;

  if (typeSelect) {
    typeSelect.value = course.type || "";
  }

  if (searchInput) {
    searchInput.value = course.name;
  }

  if (selectedName) {
    selectedName.textContent = course.name;
  }

  if (courseCode) {
    courseCode.value = selectedCourse.courseCode || course.code || "";
  }

  if (groupCode) {
    groupCode.value = selectedCourse.groupCode || "";
  }

  if (teacherName) {
    teacherName.value = selectedCourse.teacher || "";
  }

  if (courseDay) {
    courseDay.value = selectedCourse.day || "";
  }

  if (startTime) {
    startTime.value = selectedCourse.startTime || "";
  }

  if (endTime) {
    endTime.value = selectedCourse.endTime || "";
  }

  if (selectedForm) {
    selectedForm.classList.add("show");
  }

  if (title) {
    title.textContent = "ویرایش درس";
  }

  if (confirmButton) {
    confirmButton.textContent = "ذخیره تغییرات";
  }

  if (modal) {
    modal.classList.add("active");
  }

  searchCourses();
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
          <div class="course-actions">
            <button
              type="button"
              class="edit-course-button"
              data-course-id="${course.id}"
              title="ویرایش"
              aria-label="ویرایش"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 20H21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />

                <path
                  d="M16.5 3.5C17.3284 2.67157 18.6716 2.67157 19.5 3.5C20.3284 4.32843 20.3284 5.67157 19.5 6.5L8 18L3 19L4 14L16.5 3.5Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              class="remove-course-button"
              data-course-id="${course.id}"
              title="حذف"
              aria-label="حذف"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 7H20"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />

                <path
                  d="M10 11V17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />

                <path
                  d="M14 11V17"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />

                <path
                  d="M6 7L7 20H17L18 7"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />

                <path
                  d="M9 7V4H15V7"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </td>
      `;

    const editButton = row.querySelector(".edit-course-button");

    const removeButton = row.querySelector(".remove-course-button");

    editButton.addEventListener("click", () => editSelectedCourse(course.id));

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
/* =========================
   Schedule Export
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const exportButton = document.getElementById("exportScheduleButton");
  const exportModal = document.getElementById("exportScheduleModal");
  const closeExportButton = document.getElementById("closeExportSchedule");

  const exportCoursesTableBody = document.getElementById(
    "exportCoursesTableBody",
  );

  const exportCourseCount = document.getElementById("exportCourseCount");
  const exportUnitCount = document.getElementById("exportUnitCount");
  const exportSemester = document.getElementById("exportSemester");
  /* =========================
     Export Themes
  ========================= */

  const exportPreview = document.getElementById("scheduleExportPreview");

  const exportThemeOptions = document.querySelectorAll(".export-theme-option");

  function setExportTheme(theme) {
    if (!exportPreview) {
      return;
    }

    exportPreview.dataset.theme = theme;

    exportThemeOptions.forEach((button) => {
      button.classList.toggle("active", button.dataset.exportTheme === theme);
    });
  }

  exportThemeOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.exportTheme;

      if (!theme) {
        return;
      }

      setExportTheme(theme);
    });
  });

  setExportTheme("light");
  if (
    !exportButton ||
    !exportModal ||
    !closeExportButton ||
    !exportCoursesTableBody ||
    !exportCourseCount ||
    !exportUnitCount ||
    !exportSemester
  ) {
    console.error("عناصر خروجی انتخاب واحد پیدا نشدند.");
    return;
  }

  /* =========================
     Get Selected Courses
  ========================= */

  function getExportCourses() {
    try {
      const savedCourses = localStorage.getItem(SELECTED_COURSES_KEY);

      if (!savedCourses) {
        return [];
      }

      const courses = JSON.parse(savedCourses);

      return Array.isArray(courses) ? courses : [];
    } catch (error) {
      console.error("خطا در خواندن دروس انتخاب شده:", error);

      return [];
    }
  }

  /* =========================
     Get Current Semester
  ========================= */

  function getCurrentSemesterForExport() {
    return localStorage.getItem(CURRENT_SEMESTER_KEY) || "ترم جاری";
  }

  /* =========================
     Render Export Courses
  ========================= */

  function renderExportCourses() {
    const selectedCourses = getExportCourses();

    exportCoursesTableBody.innerHTML = "";

    if (selectedCourses.length === 0) {
      exportCoursesTableBody.innerHTML = `
      <tr>
        <td colspan="7">
          هنوز درسی انتخاب نشده است.
        </td>
      </tr>
    `;

      exportCourseCount.textContent = "0";
      exportUnitCount.textContent = "0";

      return;
    }

    let totalUnits = 0;
    let renderedCoursesCount = 0;

    selectedCourses.forEach((selectedCourse, index) => {
      const course = courses.find(
        (item) => Number(item.id) === Number(selectedCourse.courseId),
      );

      if (!course) {
        return;
      }

      renderedCoursesCount++;

      const units = Number(course.units) || 0;

      totalUnits += units;

      const courseName = course.name || "بدون نام";

      const courseCode = selectedCourse.courseCode || course.code || "بدون کد";

      const groupCode = selectedCourse.groupCode || "بدون کد گروه";

      const teacher = selectedCourse.teacher || "بدون استاد";

      const day = selectedCourse.day || "-";

      let time = "-";

      if (selectedCourse.startTime && selectedCourse.endTime) {
        time = `${selectedCourse.startTime} تا ` + `${selectedCourse.endTime}`;
      } else if (selectedCourse.startTime) {
        time = selectedCourse.startTime;
      }

      const row = document.createElement("tr");

      row.innerHTML = `
      <td>
        ${renderedCoursesCount}
      </td>

      <td>
        ${courseName}
      </td>

      <td>
        ${courseCode}
      </td>

      <td>
        ${groupCode}
      </td>

      <td>
        ${units}
      </td>

      <td>
        ${teacher}
      </td>

      <td>
        ${day}
        ${day !== "-" && time !== "-" ? " | " : ""}
        ${time}
      </td>
    `;

      exportCoursesTableBody.appendChild(row);
    });

    exportCourseCount.textContent = renderedCoursesCount;

    exportUnitCount.textContent = totalUnits;
  }

  /* =========================
     Open Export Modal
  ========================= */

  function openExportModal() {
    renderExportCourses();

    exportSemester.textContent = getCurrentSemesterForExport();

    exportModal.classList.add("show");
    exportModal.classList.add("active");
  }

  /* =========================
     Close Export Modal
  ========================= */

  function closeExportModal() {
    exportModal.classList.remove("show");
    exportModal.classList.remove("active");
  }

  /* =========================
     Export Button
  ========================= */

  exportButton.addEventListener("click", openExportModal);

  /* =========================
     Close Button
  ========================= */

  closeExportButton.addEventListener("click", closeExportModal);

  /* =========================
     Click Outside Modal
  ========================= */

  exportModal.addEventListener("click", (event) => {
    if (event.target === exportModal) {
      closeExportModal();
    }
  });

  /* =========================
     ESC Key
  ========================= */

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      (exportModal.classList.contains("show") ||
        exportModal.classList.contains("active"))
    ) {
      closeExportModal();
    }
  });
  /* =========================
     Download Schedule Image
  ========================= */

  const downloadScheduleButton = document.getElementById(
    "downloadScheduleImage",
  );

  if (downloadScheduleButton) {
    downloadScheduleButton.addEventListener("click", async () => {
      const preview = document.getElementById("scheduleExportPreview");

      if (!preview) {
        console.error("بخش پیش‌نمایش خروجی پیدا نشد.");

        return;
      }

      if (typeof html2canvas === "undefined") {
        console.error("کتابخانه html2canvas بارگذاری نشده است.");

        return;
      }

      const originalText = downloadScheduleButton.textContent;

      try {
        downloadScheduleButton.disabled = true;

        downloadScheduleButton.textContent = "در حال ساخت تصویر...";

        /* =========================
             Wait For Fonts
          ========================= */

        if (document.fonts) {
          await document.fonts.ready;
        }

        /*
         * کمی زمان برای تکمیل رندر
         * فونت و متن‌های فارسی
         */
        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });

        /* =========================
             Create Image
          ========================= */

        const canvas = await html2canvas(preview, {
          scale: 3,

          useCORS: true,

          allowTaint: false,

          backgroundColor: "#ffffff",

          logging: false,

          imageTimeout: 0,

          foreignObjectRendering: false,

          removeContainer: true,
        });

        /* =========================
             Download
          ========================= */

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              throw new Error("ساخت فایل تصویر انجام نشد.");
            }

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = "برنامه-انتخاب-واحد.png";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            setTimeout(() => {
              URL.revokeObjectURL(url);
            }, 1000);
          },
          "image/png",
          1,
        );
      } catch (error) {
        console.error("خطا در ساخت تصویر:", error);

        alert("ساخت تصویر با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
      } finally {
        downloadScheduleButton.disabled = false;

        downloadScheduleButton.textContent = originalText;
      }
    });
  }
});
