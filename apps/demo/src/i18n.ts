import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: "en",
  resources: {
    en: {
      translation: {
        leftMenu: {
          polygons: {
            title: "Polygons",
            arrows: "Arrows",
            texts: "Texts",
            rects: "Rects",
            same: "Same",
            randomRectangles: "RandRects",
            random: "Random",
            starAndRect: "Star & rect",
            spiral: "Spiral",
            gridAndStar: "Grid & star",
            glyph: "Glyph",
            custom: "Custom",
          },
          subjectFillType: {
            title: "Subject FillType",
            evenOdd: "EvenOdd",
            nonZero: "NonZero",
          },
          clipFillType: {
            title: "Clip FillType",
            evenOdd: "EvenOdd",
            nonZero: "NonZero",
          },
          clipTypeOperation: {
            title: "Clip type (operation)",
            none: "No",
            intersect: "Intersect",
            union: "Union",
            difference: "Difference",
            xor: "Xor",
          },
          cleaningAndSimplifying: { title: "Cleaning and simplifying" },
          offsetting: {
            title: "Offsetting",
            polygon: { title: "Polygon", subject: "Subject", clip: "Clip", solution: "Solution" },
            joinType: { title: "JoinType", square: "Square", round: "Round", miter: "Miter" },
            delta: "Delta",
            miterLimit: "MiterLimit",
          },
          scale: { title: "Scale", scale: "Scale" },
          misc: { title: "Misc" },
        },
        bottomMenu: {
          polygonExplorer: { enabled: "Enable Explorer" },
        },
      },
    },
    uk: {
      translation: {
        leftMenu: {
          polygons: { title: "Полігони" },
          subjectFillType: { title: "Тип заповнення суб’єкта" },
          clipFillType: { title: "Тип заповнення відсікача" },
          clipTypeOperation: { title: "Тип операції відсікання" },
          cleaningAndSimplifying: { title: "Очищення та спрощення" },
          offsetting: { title: "Зсув" },
          scale: { title: "Масштаб" },
          misc: { title: "Інше" },
        },
      },
    },
    de: {
      translation: {
        leftMenu: {
          polygons: { title: "Polygone" },
          subjectFillType: { title: "Füllregel für Subjekt" },
          clipFillType: { title: "Füllregel für Schnittform" },
          clipTypeOperation: { title: "Schnittart (Operation)" },
          cleaningAndSimplifying: { title: "Bereinigung und Vereinfachung" },
          offsetting: { title: "Versatz" },
          scale: { title: "Skalierung" },
          misc: { title: "Verschiedenes" },
        },
      },
    },
    pl: {
      translation: {
        leftMenu: {
          polygons: { title: "Wielokąty" },
          subjectFillType: { title: "Typ wypełnienia obiektu" },
          clipFillType: { title: "Typ wypełnienia przycinania" },
          clipTypeOperation: { title: "Typ przycinania (operacja)" },
          cleaningAndSimplifying: { title: "Czyszczenie i upraszczanie" },
          offsetting: { title: "Odsunięcie" },
          scale: { title: "Skala" },
          misc: { title: "Różne" },
        },
      },
    },
  },
  supportedLngs: ["en", "uk", "de", "pl"],
});

i18n.addResourceBundle("uk", "translation", {
  leftMenu: {
    polygons: { arrows: "\u0421\u0442\u0440\u0456\u043b\u043a\u0438", texts: "\u0422\u0435\u043a\u0441\u0442\u0438", rects: "\u041f\u0440\u044f\u043c\u043e\u043a\u0443\u0442\u043d\u0438\u043a\u0438", same: "\u041e\u0434\u043d\u0430\u043a\u043e\u0432\u0456", randomRectangles: "\u0412\u0438\u043f\u0430\u0434\u043a\u043e\u0432\u0456 \u043f\u0440\u044f\u043c\u043e\u043a\u0443\u0442\u043d\u0438\u043a\u0438", random: "\u0412\u0438\u043f\u0430\u0434\u043a\u043e\u0432\u0456", starAndRect: "\u0417\u0456\u0440\u043a\u0430 \u0442\u0430 \u043f\u0440\u044f\u043c\u043e\u043a\u0443\u0442\u043d\u0438\u043a", spiral: "\u0421\u043f\u0456\u0440\u0430\u043b\u044c", gridAndStar: "\u0421\u0456\u0442\u043a\u0430 \u0442\u0430 \u0437\u0456\u0440\u043a\u0430", glyph: "\u0413\u043b\u0456\u0444", custom: "\u0412\u043b\u0430\u0441\u043d\u0456" },
    subjectFillType: { evenOdd: "\u041f\u0430\u0440\u043d\u0435-\u043d\u0435\u043f\u0430\u0440\u043d\u0435", nonZero: "\u041d\u0435\u043d\u0443\u043b\u044c\u043e\u0432\u0435" },
    clipFillType: { evenOdd: "\u041f\u0430\u0440\u043d\u0435-\u043d\u0435\u043f\u0430\u0440\u043d\u0435", nonZero: "\u041d\u0435\u043d\u0443\u043b\u044c\u043e\u0432\u0435" },
    clipTypeOperation: { none: "\u041d\u0456", intersect: "\u041f\u0435\u0440\u0435\u0442\u0438\u043d", union: "\u041e\u0431\u2019\u0454\u0434\u043d\u0430\u043d\u043d\u044f", difference: "\u0420\u0456\u0437\u043d\u0438\u0446\u044f", xor: "\u0412\u0438\u043a\u043b\u044e\u0447\u043d\u0435 \u0430\u0431\u043e" },
    offsetting: { polygon: { title: "\u041f\u043e\u043b\u0456\u0433\u043e\u043d", subject: "\u0421\u0443\u0431\u2019\u0454\u043a\u0442", clip: "\u0412\u0456\u0434\u0441\u0456\u043a\u0430\u0447", solution: "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442" }, joinType: { title: "\u0422\u0438\u043f \u0437\u2019\u0454\u0434\u043d\u0430\u043d\u043d\u044f", square: "\u041a\u0432\u0430\u0434\u0440\u0430\u0442\u043d\u0435", round: "\u041a\u0440\u0443\u0433\u043b\u0435", miter: "\u0417\u0430\u0433\u043e\u0441\u0442\u0440\u0435\u043d\u0435" } },
  },
}, true, true);

i18n.addResourceBundle("de", "translation", {
  leftMenu: {
    polygons: { arrows: "Pfeile", texts: "Texte", rects: "Rechtecke", same: "Gleich", randomRectangles: "Zufallsrechtecke", random: "Zuf\u00e4llig", starAndRect: "Stern & Rechteck", spiral: "Spirale", gridAndStar: "Raster & Stern", glyph: "Glyphe", custom: "Benutzerdefiniert" },
    subjectFillType: { evenOdd: "Gerade-ungerade", nonZero: "Ungleich null" },
    clipFillType: { evenOdd: "Gerade-ungerade", nonZero: "Ungleich null" },
    clipTypeOperation: { none: "Keine", intersect: "Schnittmenge", union: "Vereinigung", difference: "Differenz", xor: "Exklusiv-oder" },
    offsetting: { polygon: { title: "Polygon", subject: "Subjekt", clip: "Schnittform", solution: "Lösung" }, joinType: { title: "Verbindungstyp", square: "Quadrat", round: "Rund", miter: "Gehrung" } },
  },
}, true, true);

i18n.addResourceBundle("pl", "translation", {
  leftMenu: {
    polygons: { arrows: "Strza\u0142ki", texts: "Teksty", rects: "Prostok\u0105ty", same: "Takie same", randomRectangles: "Losowe prostok\u0105ty", random: "Losowe", starAndRect: "Gwiazda i prostok\u0105t", spiral: "Spirala", gridAndStar: "Siatka i gwiazda", glyph: "Glif", custom: "W\u0142asne" },
    subjectFillType: { evenOdd: "Parzyste-nieparzyste", nonZero: "Niezerowe" },
    clipFillType: { evenOdd: "Parzyste-nieparzyste", nonZero: "Niezerowe" },
    clipTypeOperation: { none: "Brak", intersect: "Przeci\u0119cie", union: "Suma", difference: "R\u00f3\u017cnica", xor: "Alternatywa wykluczaj\u0105ca" },
    offsetting: { polygon: { title: "Wielok\u0105t", subject: "Obiekt", clip: "Przycinanie", solution: "Wynik" }, joinType: { title: "Typ \u0142\u0105czenia", square: "Kwadratowe", round: "Zaokr\u0105glone", miter: "Ukos" } },
  },
}, true, true);

const checkboxTranslations = {
  en: {
    cleaningAndSimplifying: { clean: "Clean", simplify: "Simplify", lighten: "Lighten" },
    offsetting: { autoFix: "AutoFix" },
    misc: { bevel: "Bevel", showSvgSource: "Show SVG source", showEnlargedSvg: "Show enlarged SVG" },
  },
  uk: {
    cleaningAndSimplifying: { clean: "\u041e\u0447\u0438\u0441\u0442\u0438\u0442\u0438", simplify: "\u0421\u043f\u0440\u043e\u0441\u0442\u0438\u0442\u0438", lighten: "\u041f\u043e\u043b\u0435\u0433\u0448\u0438\u0442\u0438" },
    offsetting: { autoFix: "\u0410\u0432\u0442\u043e\u0432\u0438\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043d\u044f" },
    misc: { bevel: "\u0421\u043a\u0456\u0441", showSvgSource: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u0438 SVG-\u043a\u043e\u0434", showEnlargedSvg: "\u041f\u043e\u043a\u0430\u0437\u0430\u0442\u0438 \u0437\u0431\u0456\u043b\u044c\u0448\u0435\u043d\u0435 SVG" },
  },
  de: {
    cleaningAndSimplifying: { clean: "Bereinigen", simplify: "Vereinfachen", lighten: "Ausd\u00fcnnen" },
    offsetting: { autoFix: "Automatische Korrektur" },
    misc: { bevel: "Abschr\u00e4gung", showSvgSource: "SVG-Quelle anzeigen", showEnlargedSvg: "Vergr\u00f6\u00dfertes SVG anzeigen" },
  },
  pl: {
    cleaningAndSimplifying: { clean: "Czyszczenie", simplify: "Upro\u015bczenie", lighten: "Odchudzenie" },
    offsetting: { autoFix: "Automatyczna korekta" },
    misc: { bevel: "Ukosowanie", showSvgSource: "Poka\u017c \u017ar\u00f3d\u0142o SVG", showEnlargedSvg: "Poka\u017c powi\u0119kszone SVG" },
  },
};

Object.entries(checkboxTranslations).forEach(([language, leftMenu]) => {
  i18n.addResourceBundle(language, "translation", { leftMenu }, true, true);
});

export default i18n;
