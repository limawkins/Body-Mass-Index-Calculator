
document.querySelector(".radio").addEventListener("click", (e) => {
  const metricElement = document.getElementById("metric");
  const imperialElement = document.getElementById("imperial");
  const welcomeElement = document.querySelector(".welcome");
  const outputContainer = document.querySelector(".output-container");
  const inputTypeNumber = document.querySelectorAll("input[type='number']");

  if (e.target.value === "metric" || e.target.value === "imperial") {
    metricElement.style.display =
      e.target.value === "metric" ? "block" : "none";
    imperialElement.style.display =
      e.target.value === "imperial" ? "block" : "none";

    // Всегда показываем секцию приветствия и скрываем результаты ИМТ
    welcomeElement.style.display = "block";
    outputContainer.style.display = "none";

    // Очищаем все поля ввода
    for (input of inputTypeNumber) {
      input.value = "";
    }
  }
});

class Units {
  constructor() {}
  getElements(type) {
    return [...document.querySelectorAll(`.input-${type}`)];
  }
  showBmi(bmi) {
    // Скрыть приветственное сообщение и показать секцию с результатом
    document.querySelector(".welcome").style.display = "none";
    document.querySelector(".output-container").style.display = "flex";
    document.getElementById("bmi").textContent = bmi;
  }
  weightClassification(bmi) {
    // Классификация ИМТ
    if (bmi > 30) {
      document.getElementById("classification").textContent = "Ожирение";
    } else if (bmi > 25) {
      document.getElementById("classification").textContent = "Избыточный вес";
    } else if (bmi > 18.5) {
      document.getElementById("classification").textContent = "Нормальный вес";
    } else if (bmi > 0) {
      document.getElementById("classification").textContent = "Недостаточный вес";
    }
  }
  healthyWeight(height, type) {
    const lowerBmi = 18.5;
    const upperBmi = 25;

    let lowerWeight, upperWeight;

    if (type === "metric") {
      // Расчет минимального и максимального веса в метрической системе
      const lowerWeightFormulaMetric = lowerBmi * Math.pow(height / 100, 2);
      const upperWeightFormulaMetric = upperBmi * Math.pow(height / 100, 2);

      const lowerWeightFixed = lowerWeightFormulaMetric.toFixed(1);
      const upperWeightFixed = upperWeightFormulaMetric.toFixed(1);

      lowerWeight = `${lowerWeightFixed} кг`;
      upperWeight = `${upperWeightFixed} кг`;
    } else {
      // Расчет веса для британской системы (имперской)
      const lowerWeightFormulaImperial = (lowerBmi * height) / 703;
      const upperWeightFormulaImperial = (upperBmi * height) / 703;

      const lowerStone = Math.floor(lowerWeightFormulaImperial / 14);
      const upperStone = Math.floor(upperWeightFormulaImperial / 14);

      const lowerLbs = Math.floor(lowerWeightFormulaImperial % 14);
      const upperLbs = Math.floor(upperWeightFormulaImperial % 14);

      lowerWeight = `${lowerStone}st ${lowerLbs}lbs`;
      upperWeight = `${upperStone}st ${upperLbs}lbs`;
    }

    document.getElementById("range").textContent = `${lowerWeight} - ${upperWeight}`;
  }
}

class Metric extends Units {
  constructor() {
    super();
    this.elements = this.getElements("metric");

    this.elements.forEach((element) => {
      element.addEventListener("input", this.getBmiMetric.bind(this));
    });
  }
  getBmiMetric() {
    const [cm, kg] = this.elements;

    if (this.elements.every((input) => input.value !== "")) {
      const bmiMetric = kg.value / Math.pow(cm.value / 100, 2);
      const bmiMetricFixed = bmiMetric.toFixed(1);

      this.showBmi(bmiMetricFixed);
      this.weightClassification(bmiMetricFixed);
      this.healthyWeight(cm.value, "metric");
    }
  }
}

class Imperial extends Units {
  constructor() {
    super();
    this.elements = this.getElements("imperial");

    this.elements.forEach((element) => {
      element.addEventListener("input", this.getBmiImperial.bind(this));
    });
  }
  getBmiImperial() {
    const [ft, pulg, st, lbs] = this.elements;

    if (this.elements.every((input) => input.value !== "")) {
      const heightImperial = Math.pow(
        Number(ft.value * 12) + Number(pulg.value),
        2
      );
      const bmiImperial =
        ((Number(st.value * 14) + Number(lbs.value)) * 703) / heightImperial;
      const bmiImperialFixed = bmiImperial.toFixed(1);

      this.showBmi(bmiImperialFixed);
      this.weightClassification(bmiImperialFixed);
      this.healthyWeight(heightImperial, "imperial");
    }
  }
}

const metric = new Metric();
const imperial = new Imperial();