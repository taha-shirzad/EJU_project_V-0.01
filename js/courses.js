const courses = [
  // =========================
  // دروس تخصصی
  // =========================

  {
    id: 1,
    name: "برنامه سازی پیشرفته",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201405",
  },

  {
    id: 2,
    name: "سیستم عامل",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201416",
  },

  {
    id: 3,
    name: "نرم افزارهای توسعه موبایل 1",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201427",
  },

  {
    id: 4,
    name: "برنامه نویسی موبایل 1",
    units: 2,
    type: "تخصصی",
    prerequisite: ["برنامه سازی پیشرفته"],
    corequisite: [],
    prerequisiteText: "برنامه سازی پیشرفته",
    code: "41201438",
  },

  {
    id: 5,
    name: "آزمایشگاه سیستم عامل",
    units: 1,
    type: "تخصصی",
    prerequisite: ["سیستم عامل"],
    corequisite: [],
    prerequisiteText: "سیستم عامل",
    code: "41201449",
  },

  {
    id: 6,
    name: "مبانی شبکه های کامپیوتری",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201450",
  },

  {
    id: 7,
    name: "آزمایشگاه نرم افزارهای گرافیکی",
    units: 1,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201661",
  },

  {
    id: 8,
    name: "زبان فنی",
    units: 2,
    type: "تخصصی",
    prerequisite: ["زبان خارجی"],
    corequisite: [],
    prerequisiteText: "زبان خارجی",
    code: "41201665",
  },

  {
    id: 9,
    name: "پایگاه داده ها",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201676",
  },

  {
    id: 10,
    name: "تجزیه و تحلیل سیستم ها",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201687",
  },

  {
    id: 11,
    name: "طراحی وب",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201698",
  },

  {
    id: 12,
    name: "برنامه نویسی موبایل 2",
    units: 2,
    type: "تخصصی",
    prerequisite: ["برنامه نویسی موبایل 1"],
    corequisite: [],
    prerequisiteText: "برنامه نویسی موبایل 1",
    code: "41201701",
  },

  {
    id: 13,
    name: "برنامه نویسی مبتنی بر وب",
    units: 2,
    type: "تخصصی",
    prerequisite: ["طراحی وب"],
    corequisite: [],
    prerequisiteText: "طراحی وب",
    code: "41201712",
  },

  {
    id: 14,
    name: "آزمایشگاه پایگاه داده ها",
    units: 2,
    type: "تخصصی",
    prerequisite: ["پایگاه داده ها"],
    corequisite: [],
    prerequisiteText: "پایگاه داده ها",
    code: "41201723",
  },

  {
    id: 15,
    name: "مدار منطقی",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201734",
  },

  {
    id: 16,
    name: "ساختمان داده ها",
    units: 3,
    type: "تخصصی",
    prerequisite: ["برنامه سازی پیشرفته"],
    corequisite: [],
    prerequisiteText: "برنامه سازی پیشرفته",
    code: "41201745",
  },

  {
    id: 17,
    name: "برنامه نویسی سخت افزار",
    units: 2,
    type: "تخصصی",
    prerequisite: ["مدار منطقی"],
    corequisite: [],
    prerequisiteText: "مدار منطقی",
    code: "41201756",
  },

  {
    id: 18,
    name: "کارگاه شبکه های کامپیوتری",
    units: 1,
    type: "تخصصی",
    prerequisite: ["مبانی شبکه های کامپیوتری"],
    corequisite: [],
    prerequisiteText: "مبانی شبکه های کامپیوتری",
    code: "41201767",
  },

  {
    id: 19,
    name: "مبانی ساختمان گسسته",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201778",
  },

  {
    id: 20,
    name: "کارآفرینی",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201789",
  },

  {
    id: 21,
    name: "کارآموزی",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "بعد از گذراندن 40 واحد",
    condition: {
      type: "passedUnits",
      value: 40,
    },
    code: "41201803",
  },

  {
    id: 22,
    name: "پروژه",
    units: 2,
    type: "تخصصی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ترم 3 به بعد",
    condition: {
      type: "semester",
      value: 3,
    },
    code: "41201790",
  },

  // =========================
  // مهارت های عمومی
  // =========================

  {
    id: 23,
    name: "کنترل کیفیت",
    units: 2,
    type: "مهارت عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "",
  },

  {
    id: 24,
    name: "اصول و فنون مذاکره",
    units: 2,
    type: "مهارت عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "",
  },

  {
    id: 25,
    name: "مهارت های مسئله یابی",
    units: 2,
    type: "مهارت عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "",
  },

  {
    id: 26,
    name: "بازاریابی مجازی",
    units: 2,
    type: "مهارت عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "",
  },

  {
    id: 27,
    name: "تجاری سازی محصول",
    units: 2,
    type: "مهارت عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "",
  },

  {
    id: 28,
    name: "بهداشت و صیانت از محیط زیست",
    units: 2,
    type: "مهارت عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "",
  },

  // =========================
  // دروس عمومی
  // =========================

  {
    id: 29,
    name: "فارسی عمومی",
    units: 3,
    type: "عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "301",
  },

  {
    id: 30,
    name: "زبان خارجی",
    units: 3,
    type: "عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "1205",
  },

  {
    id: 31,
    name: "آئین زندگی",
    units: 2,
    type: "عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "303",
  },

  {
    id: 32,
    name: "تربیت بدنی",
    units: 1,
    type: "عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "309",
  },

  {
    id: 33,
    name: "اندیشه اسلامی 1",
    units: 2,
    type: "عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "302",
  },

  {
    id: 34,
    name: "دانش خانواده و جمعیت",
    units: 2,
    type: "عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "307",
  },

  {
    id: 35,
    name: "ارزش های دفاع مقدس",
    units: 2,
    type: "عمومی",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "318",
  },

  // =========================
  // دروس پایه
  // =========================

  {
    id: 36,
    name: "ریاضی عمومی",
    units: 3,
    type: "پایه",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "1120144",
  },

  {
    id: 37,
    name: "کارراه شغلی",
    units: 2,
    type: "پایه",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201643",
  },

  {
    id: 38,
    name: "آزمایشگاه نرم افزارهای اداری",
    units: 1,
    type: "پایه",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "ندارد",
    code: "41201654",
  },

  // =========================
  // دروس اختیاری
  // =========================

  {
    id: 39,
    name: "مباحث ویژه در برنامه نویسی",
    units: 2,
    type: "اختیاری",
    prerequisite: ["برنامه نویسی موبایل 1"],
    corequisite: [],
    prerequisiteText: "برنامه نویسی موبایل 1",
    code: "",
  },

  {
    id: 40,
    name: "هوش مصنوعی",
    units: 2,
    type: "اختیاری",
    prerequisite: [],
    corequisite: [],
    prerequisiteText: "بعد از ترم 2",
    condition: {
      type: "semester",
      value: 2,
    },
    code: "",
  },

  {
    id: 41,
    name: "بازی سازی",
    units: 2,
    type: "اختیاری",
    prerequisite: ["آزمایشگاه نرم افزارهای گرافیکی"],
    corequisite: [],
    prerequisiteText: "آزمایشگاه نرم افزارهای گرافیکی",
    code: "",
  },

  {
    id: 42,
    name: "امنیت شبکه",
    units: 2,
    type: "اختیاری",
    prerequisite: ["مبانی شبکه های کامپیوتری"],
    corequisite: [],
    prerequisiteText: "مبانی شبکه های کامپیوتری",
    code: "",
  },

  {
    id: 43,
    name: "سیستم های مدیریت محتوا",
    units: 2,
    type: "اختیاری",
    prerequisite: ["طراحی وب"],
    corequisite: [],
    prerequisiteText: "طراحی وب",
    code: "",
  },

  {
    id: 44,
    name: "اینترنت اشیا",
    units: 2,
    type: "اختیاری",
    prerequisite: ["برنامه سازی پیشرفته", "مبانی شبکه های کامپیوتری"],
    prerequisiteMode: "AND",
    corequisite: [],
    prerequisiteText: "برنامه سازی پیشرفته + مبانی شبکه های کامپیوتری",
    code: "",
  },

  {
    id: 45,
    name: "محیط های چندرسانه ای",
    units: 2,
    type: "اختیاری",
    prerequisite: ["آزمایشگاه نرم افزارهای گرافیکی"],
    corequisite: [],
    prerequisiteText: "آزمایشگاه نرم افزارهای گرافیکی",
    code: "",
  },
];
