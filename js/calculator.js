(() => {
  /* Base prices are stored in UZS. Display currency follows site language:
     RU — RUB + USD, UZ — UZS + USD, EN — USD. */
  const RATES = {
    uzsPerUsd: 12750,
    rubPerUsd: 90,
  };

  const UI = {
    ru: {
      typeHint: "Параметры расчёта",
      sectionType: "Тип продукции",
      sectionMain: "Основные параметры",
      sectionExtra: "Дополнительные параметры",
      sectionDelivery: "Доставка",
      sectionInstall: "Монтаж",
      summaryLabel: "Расчёт",
      totalLabel: "Итоговая цена",
      hint: "Ориентировочная стоимость. Финальная цена подтверждается после согласования макета и условий работ. Курсы валют — справочные.",
      openRequest: "Оставить заявку",
      sendWa: "Отправить расчёт в WhatsApp",
      name: "Имя",
      phone: "Телефон",
      comment: "Комментарий",
      commentPh: "Адрес объекта, сроки, дополнительные требования",
      submit: "Оставить заявку",
      yes: "Да",
      no: "Нет",
      install: "Монтаж",
      delivery: "Доставка",
      installOpt: "Монтаж на объекте",
      installHint: "Стоимость зависит от площади и условий работ",
      deliveryNone: "Самовывоз",
      deliveryNoneHint: "Без стоимости доставки",
      deliveryCity: "Доставка по Ташкенту",
      deliveryRegion: "Доставка по региону",
      deliveryAdd: "Добавляется к итоговой цене",
      from: "от",
      formError: "Укажите корректные имя и телефон.",
      formOk: "Заявка подготовлена. Проверьте открывшееся окно WhatsApp.",
      waTitle: "Заявка с калькулятора GIGANT MEDIA",
      waProduct: "Продукция",
      waTotal: "Итоговая цена (ориентир)",
      waName: "Имя",
      waPhone: "Телефон",
      waComment: "Комментарий",
      pageTitle: "Калькулятор стоимости — GIGANT MEDIA",
    },
    en: {
      typeHint: "Estimate parameters",
      sectionType: "Product type",
      sectionMain: "Main parameters",
      sectionExtra: "Additional parameters",
      sectionDelivery: "Delivery",
      sectionInstall: "Installation",
      summaryLabel: "Estimate",
      totalLabel: "Total price",
      hint: "Indicative estimate. Final price is confirmed after artwork and scope approval. Exchange rates are for reference.",
      openRequest: "Submit request",
      sendWa: "Send estimate via WhatsApp",
      name: "Name",
      phone: "Phone",
      comment: "Comment",
      commentPh: "Site address, deadlines, additional requirements",
      submit: "Submit request",
      yes: "Yes",
      no: "No",
      install: "Installation",
      delivery: "Delivery",
      installOpt: "On-site installation",
      installHint: "Cost depends on area and site conditions",
      deliveryNone: "Pickup",
      deliveryNoneHint: "No delivery charge",
      deliveryCity: "Delivery in Tashkent",
      deliveryRegion: "Regional delivery",
      deliveryAdd: "Added to the total price",
      from: "from",
      formError: "Enter a valid name and phone number.",
      formOk: "Request prepared. Check the WhatsApp window.",
      waTitle: "Request from GIGANT MEDIA calculator",
      waProduct: "Product",
      waTotal: "Total price (estimate)",
      waName: "Name",
      waPhone: "Phone",
      waComment: "Comment",
      pageTitle: "Cost calculator — GIGANT MEDIA",
    },
    uz: {
      typeHint: "Hisoblash parametrlari",
      sectionType: "Mahsulot turi",
      sectionMain: "Asosiy parametrlar",
      sectionExtra: "Qo‘shimcha parametrlar",
      sectionDelivery: "Yetkazib berish",
      sectionInstall: "Montaj",
      summaryLabel: "Hisob",
      totalLabel: "Yakuniy narx",
      hint: "Taxminiy narx. Yakuniy summa maket va ish shartlari kelishilgandan keyin tasdiqlanadi. Valyuta kurslari ma’lumot uchun.",
      openRequest: "Ariza qoldirish",
      sendWa: "Hisobni WhatsApp orqali yuborish",
      name: "Ism",
      phone: "Telefon",
      comment: "Izoh",
      commentPh: "Obyekt manzili, muddatlar, qo‘shimcha talablar",
      submit: "Ariza qoldirish",
      yes: "Ha",
      no: "Yo‘q",
      install: "Montaj",
      delivery: "Yetkazib berish",
      installOpt: "Obyektda montaj",
      installHint: "Narx maydon va ish sharoitiga bog‘liq",
      deliveryNone: "O‘zi olib ketish",
      deliveryNoneHint: "Yetkazib berishsiz",
      deliveryCity: "Toshkent bo‘ylab yetkazib berish",
      deliveryRegion: "Viloyatga yetkazib berish",
      deliveryAdd: "Yakuniy narxga qo‘shiladi",
      from: "dan",
      formError: "To‘g‘ri ism va telefon kiriting.",
      formOk: "Ariza tayyorlandi. WhatsApp oynasini tekshiring.",
      waTitle: "GIGANT MEDIA kalkulyatoridan ariza",
      waProduct: "Mahsulot",
      waTotal: "Yakuniy narx (taxminiy)",
      waName: "Ism",
      waPhone: "Telefon",
      waComment: "Izoh",
      pageTitle: "Narx kalkulyatori — GIGANT MEDIA",
    },
  };

  const PRODUCTS_I18N = {
    ru: {
      cards: {
        title: "Визитки",
        note: "Ориентировочный расчёт. Итоговая стоимость подтверждается менеджером после проверки макета и тиража.",
        fields: {
          qty: { label: "Тираж", options: { 100: "100 шт.", 200: "200 шт.", 500: "500 шт.", 1000: "1 000 шт.", 2000: "2 000 шт.", 5000: "5 000 шт." } },
          size: { label: "Размер", options: { "90x50": "90 × 50 мм", "85x55": "85 × 55 мм" } },
          material: { label: "Материал", options: { 300: "Мелованная бумага 300 г/м²", 350: "Мелованная бумага 350 г/м²", design: "Дизайнерский картон" } },
          color: { label: "Цветность", options: { "4_0": "4+0 (односторонняя)", "4_4": "4+4 (двусторонняя)" } },
          lamination: { label: "Ламинация", options: { none: "Без ламинации", matte: "Матовая", gloss: "Глянцевая", soft: "Soft-touch" } },
          term: { label: "Срок изготовления", options: { standard: "Стандартный (3–5 раб. дней)", express: "Ускоренный (2 раб. дня)", urgent: "Срочный (1 раб. день)" } },
        },
        extras: { corners: "Скругление углов", foil: "Тиснение фольгой", design: "Подготовка макета" },
      },
      boards: {
        title: "Рекламные щиты",
        note: "Расчёт носит ориентировочный характер. Стоимость металлоконструкции и монтажа уточняется после осмотра объекта.",
        fields: {
          qty: { label: "Количество", options: { 1: "1 шт.", 2: "2 шт.", 3: "3 шт.", 5: "5 шт.", 10: "10 шт." } },
          size: { label: "Размер", options: { "3x6": "3 × 6 м", "6x3": "6 × 3 м", "4x3": "4 × 3 м", "2x3": "2 × 3 м" } },
          material: { label: "Материал", options: { banner510: "Баннерная ткань 510 г/м²", mesh: "Сетка (mesh)", composite: "Композит / жёсткая основа" } },
          color: { label: "Цветность", options: { full: "Полноцветная печать", bw: "Монохром" } },
          lamination: { label: "Защитное покрытие", options: { none: "Без покрытия", uv: "UV-лак", laminate: "Ламинация" } },
          term: { label: "Срок изготовления", options: { standard: "Стандартный (7–10 раб. дней)", express: "Ускоренный (4–5 раб. дней)", urgent: "Срочный (2–3 раб. дня)" } },
        },
        extras: { frame: "Металлокаркас", lighting: "Подсветка конструкции", design: "Подготовка макета" },
      },
      banners: {
        title: "Баннеры",
        note: "Ориентировочный расчёт по площади. Финальная цена зависит от макета, люверсов и условий монтажа.",
        fields: {
          qty: { label: "Тираж", options: { 1: "1 шт.", 2: "2 шт.", 5: "5 шт.", 10: "10 шт.", 20: "20 шт." } },
          size: { label: "Размер", options: { "1x2": "1 × 2 м", "2x3": "2 × 3 м", "3x4": "3 × 4 м", "3x6": "3 × 6 м", custom: "Индивидуальный (ориентир 10 м²)" } },
          material: { label: "Материал", options: { 440: "Баннер 440 г/м²", 510: "Баннер 510 г/м²", mesh: "Сетка (mesh)", canvas: "Холст / интерьерный" } },
          color: { label: "Цветность", options: { full: "Полноцветная печать", bw: "Монохром" } },
          lamination: { label: "Обработка краёв", options: { none: "Без обработки", eyelets: "Люверсы", pocket: "Карман под трубу", both: "Люверсы + карман" } },
          term: { label: "Срок изготовления", options: { standard: "Стандартный (2–4 раб. дня)", express: "Ускоренный (1–2 раб. дня)", urgent: "Срочный (в течение суток)" } },
        },
        extras: { design: "Подготовка макета", double: "Двусторонняя печать" },
      },
      other: {
        title: "Прочие изделия",
        note: "Раздел для вывесок, световых коробов и POSM. Точная спецификация согласовывается с менеджером.",
        fields: {
          kind: { label: "Тип изделия", options: { letters: "Объёмные буквы", lightbox: "Световой короб", posm: "POSM / конструкция", stand: "Стенд / ролл-ап" } },
          qty: { label: "Количество", options: { 1: "1 шт.", 2: "2 шт.", 5: "5 шт.", 10: "10 шт." } },
          size: { label: "Габарит", options: { s: "Малый", m: "Средний", l: "Крупный", xl: "Нестандартный" } },
          material: { label: "Материал", options: { acrylic: "Акрил / ПВХ", composite: "Композит", metal: "Металл", mixed: "Комбинированный" } },
          color: { label: "Цветность / отделка", options: { print: "Печать", paint: "Покраска", film: "Плёнка" } },
          lamination: { label: "Подсветка", options: { none: "Без подсветки", front: "Лицевая LED", back: "Контражур", neon: "Неон / гибкий неон" } },
          term: { label: "Срок изготовления", options: { standard: "Стандартный (7–14 раб. дней)", express: "Ускоренный (5–7 раб. дней)", urgent: "Срочный (3–4 раб. дня)" } },
        },
        extras: { design: "Дизайн и визуализация", survey: "Выезд на замер" },
      },
    },
    en: {
      cards: {
        title: "Business cards",
        note: "Indicative estimate. Final cost is confirmed by a manager after artwork and print run review.",
        fields: {
          qty: { label: "Print run", options: { 100: "100 pcs", 200: "200 pcs", 500: "500 pcs", 1000: "1,000 pcs", 2000: "2,000 pcs", 5000: "5,000 pcs" } },
          size: { label: "Size", options: { "90x50": "90 × 50 mm", "85x55": "85 × 55 mm" } },
          material: { label: "Material", options: { 300: "Coated paper 300 gsm", 350: "Coated paper 350 gsm", design: "Design board" } },
          color: { label: "Color", options: { "4_0": "4+0 (single-sided)", "4_4": "4+4 (double-sided)" } },
          lamination: { label: "Lamination", options: { none: "No lamination", matte: "Matte", gloss: "Gloss", soft: "Soft-touch" } },
          term: { label: "Production time", options: { standard: "Standard (3–5 business days)", express: "Express (2 business days)", urgent: "Urgent (1 business day)" } },
        },
        extras: { corners: "Rounded corners", foil: "Foil stamping", design: "Artwork preparation" },
      },
      boards: {
        title: "Billboards",
        note: "Indicative estimate. Metal structure and installation costs are confirmed after site inspection.",
        fields: {
          qty: { label: "Quantity", options: { 1: "1 pc", 2: "2 pcs", 3: "3 pcs", 5: "5 pcs", 10: "10 pcs" } },
          size: { label: "Size", options: { "3x6": "3 × 6 m", "6x3": "6 × 3 m", "4x3": "4 × 3 m", "2x3": "2 × 3 m" } },
          material: { label: "Material", options: { banner510: "Banner fabric 510 gsm", mesh: "Mesh", composite: "Composite / rigid base" } },
          color: { label: "Color", options: { full: "Full-color print", bw: "Monochrome" } },
          lamination: { label: "Protective coating", options: { none: "No coating", uv: "UV varnish", laminate: "Lamination" } },
          term: { label: "Production time", options: { standard: "Standard (7–10 business days)", express: "Express (4–5 business days)", urgent: "Urgent (2–3 business days)" } },
        },
        extras: { frame: "Metal frame", lighting: "Structure lighting", design: "Artwork preparation" },
      },
      banners: {
        title: "Banners",
        note: "Area-based estimate. Final price depends on artwork, eyelets and installation conditions.",
        fields: {
          qty: { label: "Print run", options: { 1: "1 pc", 2: "2 pcs", 5: "5 pcs", 10: "10 pcs", 20: "20 pcs" } },
          size: { label: "Size", options: { "1x2": "1 × 2 m", "2x3": "2 × 3 m", "3x4": "3 × 4 m", "3x6": "3 × 6 m", custom: "Custom (approx. 10 m²)" } },
          material: { label: "Material", options: { 440: "Banner 440 gsm", 510: "Banner 510 gsm", mesh: "Mesh", canvas: "Canvas / indoor" } },
          color: { label: "Color", options: { full: "Full-color print", bw: "Monochrome" } },
          lamination: { label: "Edge finishing", options: { none: "No finishing", eyelets: "Eyelets", pocket: "Pole pocket", both: "Eyelets + pocket" } },
          term: { label: "Production time", options: { standard: "Standard (2–4 business days)", express: "Express (1–2 business days)", urgent: "Urgent (within 24 hours)" } },
        },
        extras: { design: "Artwork preparation", double: "Double-sided print" },
      },
      other: {
        title: "Other products",
        note: "For signs, lightboxes and POSM. Exact specification is confirmed with a manager.",
        fields: {
          kind: { label: "Product type", options: { letters: "3D letters", lightbox: "Lightbox", posm: "POSM / structure", stand: "Stand / roll-up" } },
          qty: { label: "Quantity", options: { 1: "1 pc", 2: "2 pcs", 5: "5 pcs", 10: "10 pcs" } },
          size: { label: "Size class", options: { s: "Small", m: "Medium", l: "Large", xl: "Custom" } },
          material: { label: "Material", options: { acrylic: "Acrylic / PVC", composite: "Composite", metal: "Metal", mixed: "Combined" } },
          color: { label: "Color / finish", options: { print: "Print", paint: "Paint", film: "Vinyl" } },
          lamination: { label: "Lighting", options: { none: "No lighting", front: "Front LED", back: "Backlit", neon: "Neon / flexible neon" } },
          term: { label: "Production time", options: { standard: "Standard (7–14 business days)", express: "Express (5–7 business days)", urgent: "Urgent (3–4 business days)" } },
        },
        extras: { design: "Design and visualization", survey: "Site measurement visit" },
      },
    },
    uz: {
      cards: {
        title: "Vizitkalar",
        note: "Taxminiy hisob. Yakuniy narx maket va tiraj tekshirilgandan keyin menejer tomonidan tasdiqlanadi.",
        fields: {
          qty: { label: "Tiraj", options: { 100: "100 dona", 200: "200 dona", 500: "500 dona", 1000: "1 000 dona", 2000: "2 000 dona", 5000: "5 000 dona" } },
          size: { label: "O‘lcham", options: { "90x50": "90 × 50 mm", "85x55": "85 × 55 mm" } },
          material: { label: "Material", options: { 300: "Melovan qog‘oz 300 g/m²", 350: "Melovan qog‘oz 350 g/m²", design: "Dizayn karton" } },
          color: { label: "Rangdorlik", options: { "4_0": "4+0 (bir tomonlama)", "4_4": "4+4 (ikki tomonlama)" } },
          lamination: { label: "Laminatsiya", options: { none: "Laminatsiyasiz", matte: "Mat", gloss: "Yaltiroq", soft: "Soft-touch" } },
          term: { label: "Ishlab chiqarish muddati", options: { standard: "Standart (3–5 ish kuni)", express: "Tezlashtirilgan (2 ish kuni)", urgent: "Shoshilinch (1 ish kuni)" } },
        },
        extras: { corners: "Burchaklarni yumaloqlash", foil: "Folga bosish", design: "Maket tayyorlash" },
      },
      boards: {
        title: "Reklama shiltlari",
        note: "Hisob taxminiy. Metallkonstruksiya va montaj narxi obyekt ko‘rigidan keyin aniqlanadi.",
        fields: {
          qty: { label: "Miqdor", options: { 1: "1 dona", 2: "2 dona", 3: "3 dona", 5: "5 dona", 10: "10 dona" } },
          size: { label: "O‘lcham", options: { "3x6": "3 × 6 m", "6x3": "6 × 3 m", "4x3": "4 × 3 m", "2x3": "2 × 3 m" } },
          material: { label: "Material", options: { banner510: "Banner mato 510 g/m²", mesh: "To‘r (mesh)", composite: "Kompozit / qattiq asos" } },
          color: { label: "Rangdorlik", options: { full: "To‘liq rangli bosma", bw: "Monoxrom" } },
          lamination: { label: "Himoya qoplama", options: { none: "Qoplamasiz", uv: "UV-lak", laminate: "Laminatsiya" } },
          term: { label: "Ishlab chiqarish muddati", options: { standard: "Standart (7–10 ish kuni)", express: "Tezlashtirilgan (4–5 ish kuni)", urgent: "Shoshilinch (2–3 ish kuni)" } },
        },
        extras: { frame: "Metallkarkas", lighting: "Konstruksiya yoritishi", design: "Maket tayyorlash" },
      },
      banners: {
        title: "Bannerlar",
        note: "Maydon bo‘yicha taxminiy hisob. Yakuniy narx maket, lyuvers va montaj shartlariga bog‘liq.",
        fields: {
          qty: { label: "Tiraj", options: { 1: "1 dona", 2: "2 dona", 5: "5 dona", 10: "10 dona", 20: "20 dona" } },
          size: { label: "O‘lcham", options: { "1x2": "1 × 2 m", "2x3": "2 × 3 m", "3x4": "3 × 4 m", "3x6": "3 × 6 m", custom: "Individual (taxminan 10 m²)" } },
          material: { label: "Material", options: { 440: "Banner 440 g/m²", 510: "Banner 510 g/m²", mesh: "To‘r (mesh)", canvas: "Canvas / interyer" } },
          color: { label: "Rangdorlik", options: { full: "To‘liq rangli bosma", bw: "Monoxrom" } },
          lamination: { label: "Chetlarni ishlash", options: { none: "Ishlovsiz", eyelets: "Lyuverslar", pocket: "Truba uchun cho‘ntak", both: "Lyuvers + cho‘ntak" } },
          term: { label: "Ishlab chiqarish muddati", options: { standard: "Standart (2–4 ish kuni)", express: "Tezlashtirilgan (1–2 ish kuni)", urgent: "Shoshilinch (sutka ichida)" } },
        },
        extras: { design: "Maket tayyorlash", double: "Ikki tomonlama bosma" },
      },
      other: {
        title: "Boshqa buyumlar",
        note: "Yorliqlar, yoritilgan qutilar va POSM uchun. Aniq spesifikasiya menejer bilan kelishiladi.",
        fields: {
          kind: { label: "Buyum turi", options: { letters: "Hajmli harflar", lightbox: "Yoritilgan quti", posm: "POSM / konstruksiya", stand: "Stend / roll-up" } },
          qty: { label: "Miqdor", options: { 1: "1 dona", 2: "2 dona", 5: "5 dona", 10: "10 dona" } },
          size: { label: "Gabarit", options: { s: "Kichik", m: "O‘rta", l: "Katta", xl: "Nostandart" } },
          material: { label: "Material", options: { acrylic: "Akril / PVX", composite: "Kompozit", metal: "Metall", mixed: "Aralash" } },
          color: { label: "Rangdorlik / bezak", options: { print: "Bosma", paint: "Bo‘yash", film: "Plyonka" } },
          lamination: { label: "Yoritish", options: { none: "Yoritishsiz", front: "Old LED", back: "Kontrajur", neon: "Neon / egiluvchan neon" } },
          term: { label: "Ishlab chiqarish muddati", options: { standard: "Standart (7–14 ish kuni)", express: "Tezlashtirilgan (5–7 ish kuni)", urgent: "Shoshilinch (3–4 ish kuni)" } },
        },
        extras: { design: "Dizayn va vizualizatsiya", survey: "O‘lchovga chiqish" },
      },
    },
  };

  const PRODUCTS = {
    cards: {
      fieldOrder: ["qty", "size", "material", "color", "lamination", "term"],
      extras: [
        { id: "corners", priceLabel: "+15%" },
        { id: "foil", priceLabel: "+35%" },
        { id: "design", priceUzs: 150000 },
      ],
      install: false,
      calc(state) {
        const qty = Number(state.qty);
        const basePerUnit = { 100: 1800, 200: 1200, 500: 750, 1000: 520, 2000: 390, 5000: 280 }[qty] || 520;
        let total = qty * basePerUnit;
        if (state.material === "350") total *= 1.12;
        if (state.material === "design") total *= 1.45;
        if (state.color === "4_4") total *= 1.55;
        if (state.lamination === "matte" || state.lamination === "gloss") total *= 1.18;
        if (state.lamination === "soft") total *= 1.32;
        if (state.term === "express") total *= 1.25;
        if (state.term === "urgent") total *= 1.55;
        if (state.corners) total *= 1.15;
        if (state.foil) total *= 1.35;
        if (state.design) total += 150000;
        if (state.delivery === "city") total += 45000;
        if (state.delivery === "region") total += 120000;
        return total;
      },
    },
    boards: {
      fieldOrder: ["qty", "size", "material", "color", "lamination", "term"],
      extras: [
        { id: "frame", priceUzs: 1800000 },
        { id: "lighting", priceLabel: "+40%" },
        { id: "design", priceUzs: 250000 },
      ],
      install: true,
      calc(state) {
        const qty = Number(state.qty);
        const area = { "3x6": 18, "6x3": 18, "4x3": 12, "2x3": 6 }[state.size] || 18;
        let rate = 95000;
        if (state.material === "mesh") rate = 110000;
        if (state.material === "composite") rate = 185000;
        let total = qty * area * rate;
        if (state.color === "bw") total *= 0.72;
        if (state.lamination === "uv") total *= 1.12;
        if (state.lamination === "laminate") total *= 1.2;
        if (state.term === "express") total *= 1.2;
        if (state.term === "urgent") total *= 1.45;
        if (state.frame) total += qty * 1800000;
        if (state.lighting) total *= 1.4;
        if (state.design) total += 250000;
        if (state.install) total += qty * area * 35000;
        if (state.delivery === "city") total += 250000;
        if (state.delivery === "region") total += 650000;
        return total;
      },
    },
    banners: {
      fieldOrder: ["qty", "size", "material", "color", "lamination", "term"],
      extras: [
        { id: "design", priceUzs: 180000 },
        { id: "double", priceLabel: "+70%" },
      ],
      install: true,
      calc(state) {
        const qty = Number(state.qty);
        const area = { "1x2": 2, "2x3": 6, "3x4": 12, "3x6": 18, custom: 10 }[state.size] || 6;
        let rate = 42000;
        if (state.material === "510") rate = 52000;
        if (state.material === "mesh") rate = 58000;
        if (state.material === "canvas") rate = 78000;
        let total = qty * area * rate;
        if (state.color === "bw") total *= 0.7;
        if (state.lamination === "eyelets") total += qty * area * 4000;
        if (state.lamination === "pocket") total += qty * area * 5500;
        if (state.lamination === "both") total += qty * area * 8500;
        if (state.term === "express") total *= 1.2;
        if (state.term === "urgent") total *= 1.5;
        if (state.design) total += 180000;
        if (state.double) total *= 1.7;
        if (state.install) total += qty * Math.max(area, 4) * 18000;
        if (state.delivery === "city") total += 80000;
        if (state.delivery === "region") total += 220000;
        return total;
      },
    },
    other: {
      fieldOrder: ["kind", "qty", "size", "material", "color", "lamination", "term"],
      extras: [
        { id: "design", priceUzs: 350000 },
        { id: "survey", priceUzs: 150000 },
      ],
      install: true,
      calc(state) {
        const qty = Number(state.qty);
        let base = { letters: 2200000, lightbox: 2800000, posm: 650000, stand: 480000 }[state.kind] || 1000000;
        const sizeMul = { s: 0.75, m: 1, l: 1.45, xl: 2.1 }[state.size] || 1;
        let total = qty * base * sizeMul;
        if (state.material === "composite") total *= 1.15;
        if (state.material === "metal") total *= 1.35;
        if (state.material === "mixed") total *= 1.25;
        if (state.color === "paint") total *= 1.08;
        if (state.color === "film") total *= 1.05;
        if (state.lamination === "front") total *= 1.35;
        if (state.lamination === "back") total *= 1.28;
        if (state.lamination === "neon") total *= 1.55;
        if (state.term === "express") total *= 1.2;
        if (state.term === "urgent") total *= 1.4;
        if (state.design) total += 350000;
        if (state.survey) total += 150000;
        if (state.install) total += qty * 450000 * sizeMul;
        if (state.delivery === "city") total += 180000;
        if (state.delivery === "region") total += 480000;
        return total;
      },
    },
  };

  const root = document.querySelector("[data-calculator]");
  if (!root) return;

  const typesEl = root.querySelector("[data-calc-types]");
  const fieldsEl = root.querySelector("[data-calc-fields]");
  const extrasEl = root.querySelector("[data-calc-extras]");
  const deliveryEl = root.querySelector("[data-calc-delivery]");
  const installEl = root.querySelector("[data-calc-install]");
  const noteEl = root.querySelector("[data-calc-note]");
  const productEl = root.querySelector("[data-calc-product]");
  const listEl = root.querySelector("[data-calc-list]");
  const totalEl = root.querySelector("[data-calc-total]");
  const totalAltEl = root.querySelector("[data-calc-total-alt]");
  const requestWrap = root.querySelector("[data-calc-request]");
  const openRequestBtn = root.querySelector("[data-calc-open-request]");
  const form = root.querySelector("[data-calc-form]");
  const statusEl = root.querySelector("[data-calc-status]");
  const waBtn = root.querySelector("[data-calc-wa]");
  const sectionTitles = {
    type: document.querySelector("[data-calc-section-type]"),
    main: document.querySelector("[data-calc-section-main]"),
    summary: document.querySelector("[data-calc-summary-label]"),
    total: document.querySelector("[data-calc-total-label]"),
    hint: document.querySelector("[data-calc-hint]"),
  };

  let productId = "cards";
  let state = {};

  const getLang = () => {
    const saved = localStorage.getItem("gm-lang");
    if (saved && UI[saved]) return saved;
    return window.GM_I18N?.lang && UI[window.GM_I18N.lang] ? window.GM_I18N.lang : "ru";
  };

  const ui = () => UI[getLang()] || UI.ru;
  const productCopy = (id = productId) => (PRODUCTS_I18N[getLang()] || PRODUCTS_I18N.ru)[id];

  const groupNumber = (value, locale) =>
    Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, locale === "en" ? "," : "\u00a0");

  const formatCurrency = (amount, currency, lang) => {
    const locale = lang === "en" ? "en" : lang === "uz" ? "uz" : "ru";
    if (currency === "USD") return `${groupNumber(amount, locale)} USD`;
    if (currency === "RUB") return `${groupNumber(amount, locale)} ₽`;
    return `${groupNumber(amount, locale)} ${lang === "uz" ? "so‘m" : "сум"}`;
  };

  const priceParts = (uzsTotal, lang = getLang()) => {
    const usd = uzsTotal / RATES.uzsPerUsd;
    const rub = usd * RATES.rubPerUsd;
    if (lang === "ru") {
      return {
        primary: formatCurrency(rub, "RUB", lang),
        secondary: `≈ ${formatCurrency(usd, "USD", lang)}`,
        plain: `${formatCurrency(rub, "RUB", lang)} / ${formatCurrency(usd, "USD", lang)}`,
      };
    }
    if (lang === "uz") {
      return {
        primary: formatCurrency(uzsTotal, "UZS", lang),
        secondary: `≈ ${formatCurrency(usd, "USD", lang)}`,
        plain: `${formatCurrency(uzsTotal, "UZS", lang)} / ${formatCurrency(usd, "USD", lang)}`,
      };
    }
    return {
      primary: formatCurrency(usd, "USD", lang),
      secondary: "",
      plain: formatCurrency(usd, "USD", lang),
    };
  };

  const extraPriceLabel = (extra) => {
    if (extra.priceLabel) return extra.priceLabel;
    if (extra.priceUzs != null) {
      const parts = priceParts(extra.priceUzs);
      return `${ui().from} ${parts.primary}`;
    }
    return "";
  };

  const optionLabel = (fieldId, value) => {
    const copy = productCopy();
    return copy?.fields?.[fieldId]?.options?.[value] || value;
  };

  const deliveryLabel = (value) => {
    const t = ui();
    return (
      {
        none: t.deliveryNone,
        city: t.deliveryCity,
        region: t.deliveryRegion,
      }[value] || value
    );
  };

  const closeAllSelects = (except) => {
    fieldsEl.querySelectorAll(".calc-select.is-open").forEach((el) => {
      if (except && el === except) return;
      el.classList.remove("is-open");
      const trigger = el.querySelector(".calc-select__trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  };

  const setSelectValue = (wrap, value) => {
    wrap.setAttribute("data-value", value);
    const valueEl = wrap.querySelector("[data-select-value]");
    wrap.querySelectorAll("[data-option]").forEach((opt) => {
      const selected = opt.getAttribute("data-option") === value;
      opt.classList.toggle("is-selected", selected);
      opt.setAttribute("aria-selected", selected ? "true" : "false");
      if (selected && valueEl) valueEl.textContent = opt.textContent;
    });
  };

  const readState = () => {
    const next = {};
    fieldsEl.querySelectorAll("[data-field]").forEach((el) => {
      next[el.getAttribute("data-field")] = el.getAttribute("data-value");
    });
    extrasEl.querySelectorAll('input[type="checkbox"]').forEach((el) => {
      next[el.name] = el.checked;
    });
    const delivery = deliveryEl.querySelector('input[name="delivery"]:checked');
    next.delivery = delivery ? delivery.value : "none";
    const install = installEl.querySelector('input[name="install"]');
    next.install = !!(install && !install.disabled && install.checked);
    state = next;
  };

  const applyStaticUi = () => {
    const t = ui();
    document.title = t.pageTitle;
    if (sectionTitles.type) sectionTitles.type.textContent = t.sectionType;
    if (sectionTitles.main) sectionTitles.main.textContent = t.sectionMain;
    if (sectionTitles.summary) sectionTitles.summary.textContent = t.summaryLabel;
    if (sectionTitles.total) sectionTitles.total.textContent = t.totalLabel;
    if (sectionTitles.hint) sectionTitles.hint.textContent = t.hint;
    if (openRequestBtn) openRequestBtn.textContent = t.openRequest;
    if (waBtn) waBtn.textContent = t.sendWa;
    const nameLabel = form?.querySelector('label[for="calc-name"]');
    const phoneLabel = form?.querySelector('label[for="calc-phone"]');
    const commentLabel = form?.querySelector('label[for="calc-comment"]');
    const commentInput = form?.querySelector("#calc-comment");
    const submitBtn = form?.querySelector('button[type="submit"]');
    if (nameLabel) nameLabel.textContent = t.name;
    if (phoneLabel) phoneLabel.textContent = t.phone;
    if (commentLabel) commentLabel.textContent = t.comment;
    if (commentInput) commentInput.setAttribute("placeholder", t.commentPh);
    if (submitBtn) submitBtn.textContent = t.submit;
  };

  const renderTypes = () => {
    const t = ui();
    typesEl.innerHTML = Object.keys(PRODUCTS)
      .map((id) => {
        const title = productCopy(id).title;
        return `<button type="button" class="calc-type${id === productId ? " is-active" : ""}" data-product="${id}">
        ${title}
        <span>${t.typeHint}</span>
      </button>`;
      })
      .join("");
  };

  const renderFields = () => {
    const product = PRODUCTS[productId];
    const copy = productCopy();
    const t = ui();
    const prev = { ...state };

    fieldsEl.innerHTML = product.fieldOrder
      .map((fieldId) => {
        const field = copy.fields[fieldId];
        const entries = Object.entries(field.options);
        const firstValue = entries[0]?.[0] || "";
        const options = entries
          .map(
            ([value, label], index) =>
              `<li class="calc-select__option${index === 0 ? " is-selected" : ""}" role="option" data-option="${value}" aria-selected="${index === 0 ? "true" : "false"}">${label}</li>`
          )
          .join("");
        return `<div class="calc-field">
          <span class="calc-field__label" id="calc-${fieldId}-label">${field.label}</span>
          <div class="calc-select" data-field="${fieldId}" data-value="${firstValue}">
            <button type="button" class="calc-select__trigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="calc-${fieldId}-label">
              <span data-select-value>${entries[0]?.[1] || ""}</span>
              <span class="calc-select__chevron" aria-hidden="true"></span>
            </button>
            <ul class="calc-select__menu" role="listbox" aria-labelledby="calc-${fieldId}-label">${options}</ul>
          </div>
        </div>`;
      })
      .join("");

    extrasEl.innerHTML = `
      <p class="calc-section__title">${t.sectionExtra}</p>
      <div class="calc-checks">
        ${product.extras
          .map(
            (extra) => `<label class="calc-check">
              <input type="checkbox" name="${extra.id}" />
              <span>${copy.extras[extra.id]}<small>${extraPriceLabel(extra)}</small></span>
            </label>`
          )
          .join("")}
      </div>`;

    deliveryEl.innerHTML = `
      <p class="calc-section__title">${t.sectionDelivery}</p>
      <div class="calc-checks">
        <label class="calc-check"><input type="radio" name="delivery" value="none" checked /><span>${t.deliveryNone}<small>${t.deliveryNoneHint}</small></span></label>
        <label class="calc-check"><input type="radio" name="delivery" value="city" /><span>${t.deliveryCity}<small>${t.deliveryAdd}</small></span></label>
        <label class="calc-check"><input type="radio" name="delivery" value="region" /><span>${t.deliveryRegion}<small>${t.deliveryAdd}</small></span></label>
      </div>`;

    if (product.install) {
      installEl.hidden = false;
      installEl.innerHTML = `
        <p class="calc-section__title">${t.sectionInstall}</p>
        <div class="calc-checks">
          <label class="calc-check"><input type="checkbox" name="install" /><span>${t.installOpt}<small>${t.installHint}</small></span></label>
        </div>`;
    } else {
      installEl.hidden = true;
      installEl.innerHTML = "";
    }

    noteEl.textContent = copy.note;

    product.fieldOrder.forEach((fieldId) => {
      const el = fieldsEl.querySelector(`[data-field="${fieldId}"]`);
      if (el && prev[fieldId] != null) setSelectValue(el, prev[fieldId]);
    });
    product.extras.forEach((extra) => {
      const el = extrasEl.querySelector(`input[name="${extra.id}"]`);
      if (el) el.checked = !!prev[extra.id];
    });
    const delivery = deliveryEl.querySelector(`input[name="delivery"][value="${prev.delivery || "none"}"]`);
    if (delivery) delivery.checked = true;
    const install = installEl.querySelector('input[name="install"]');
    if (install) install.checked = !!prev.install;
  };

  const buildRows = () => {
    const product = PRODUCTS[productId];
    const copy = productCopy();
    const t = ui();
    const rows = product.fieldOrder.map((fieldId) => ({
      label: copy.fields[fieldId].label,
      value: optionLabel(fieldId, state[fieldId]),
    }));
    product.extras.forEach((extra) => {
      if (state[extra.id]) rows.push({ label: copy.extras[extra.id], value: t.yes });
    });
    if (product.install) {
      rows.push({ label: t.install, value: state.install ? t.yes : t.no });
    }
    rows.push({ label: t.delivery, value: deliveryLabel(state.delivery) });
    return rows;
  };

  const renderSummary = () => {
    const product = PRODUCTS[productId];
    const copy = productCopy();
    const t = ui();
    readState();
    const total = product.calc(state);
    const parts = priceParts(total);
    productEl.textContent = copy.title;

    const rows = buildRows();
    listEl.innerHTML = rows
      .map((row) => `<li><span>${row.label}</span><span>${row.value}</span></li>`)
      .join("");
    totalEl.textContent = parts.primary;
    if (totalAltEl) {
      totalAltEl.textContent = parts.secondary;
      totalAltEl.hidden = !parts.secondary;
    }

    if (waBtn) {
      const lines = [
        t.waTitle,
        `${t.waProduct}: ${copy.title}`,
        `${t.waTotal}: ${parts.plain}`,
        "",
        ...rows.map((r) => `${r.label}: ${r.value}`),
      ];
      waBtn.href = `https://wa.me/998908056692?text=${encodeURIComponent(lines.join("\n"))}`;
    }
  };

  const refresh = () => {
    applyStaticUi();
    renderTypes();
    renderFields();
    renderSummary();
  };

  const bind = () => {
    typesEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-product]");
      if (!btn) return;
      productId = btn.getAttribute("data-product");
      state = {};
      renderTypes();
      renderFields();
      renderSummary();
      if (requestWrap) requestWrap.classList.remove("is-open");
      if (statusEl) statusEl.classList.remove("is-visible");
    });

    fieldsEl.addEventListener("click", (e) => {
      const option = e.target.closest("[data-option]");
      if (option) {
        const wrap = option.closest(".calc-select");
        if (!wrap) return;
        setSelectValue(wrap, option.getAttribute("data-option"));
        closeAllSelects();
        renderSummary();
        return;
      }

      const trigger = e.target.closest(".calc-select__trigger");
      if (!trigger) return;
      const wrap = trigger.closest(".calc-select");
      if (!wrap) return;
      const willOpen = !wrap.classList.contains("is-open");
      closeAllSelects();
      if (willOpen) {
        wrap.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".calc-select")) closeAllSelects();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllSelects();
    });

    root.addEventListener("change", () => {
      renderSummary();
    });

    openRequestBtn?.addEventListener("click", () => {
      requestWrap?.classList.add("is-open");
      requestWrap?.querySelector("input")?.focus();
    });

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const t = ui();
      const name = form.querySelector('[name="name"]')?.value.trim() || "";
      const phone = form.querySelector('[name="phone"]')?.value.trim() || "";
      if (name.length < 2 || phone.replace(/\D/g, "").length < 9) {
        if (statusEl) {
          statusEl.textContent = t.formError;
          statusEl.classList.add("is-visible");
        }
        return;
      }

      const product = PRODUCTS[productId];
      const copy = productCopy();
      readState();
      const total = product.calc(state);
      const parts = priceParts(total);
      const rows = buildRows();
      const comment = form.querySelector('[name="comment"]')?.value.trim() || "";
      const text = [
        t.waTitle,
        `${t.waName}: ${name}`,
        `${t.waPhone}: ${phone}`,
        `${t.waProduct}: ${copy.title}`,
        `${t.waTotal}: ${parts.plain}`,
        "",
        ...rows.map((r) => `${r.label}: ${r.value}`),
        comment ? `\n${t.waComment}: ${comment}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      window.open(`https://wa.me/998908056692?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      if (statusEl) {
        statusEl.textContent = t.formOk;
        statusEl.classList.add("is-visible");
      }
    });

    document.addEventListener("gm:langchange", () => {
      refresh();
    });
  };

  refresh();
  bind();
})();
