<template>
  <div class="innovation-page">
    <div class="page-hero page-hero-light">
      <span class="section-tag">创新茶饮</span>
      <h1>创新茶饮全景浏览</h1>
      <div class="section-divider"></div>
      <p>茶+茶、茶+非茶、茶+跨界——三大创新方向</p>
    </div>

    <!-- ====== DRINK BROWSER ====== -->
    <section class="section">
      <div class="section-header reveal">
        <span class="section-tag">全部类型</span>
        <h2>创新茶饮分类浏览</h2>
        <div class="section-divider"></div>
      </div>
      <div class="filter-bar reveal">
        <button v-for="opt in typeOptions" :key="opt" :class="{ active: curType === opt }" @click="curType = opt" class="filter-btn">
          {{ opt }}
        </button>
      </div>
      <div class="drink-grid reveal">
        <div v-for="drink in filtered" :key="drink.茶饮名称" class="drink-card">
          <div class="drink-header">
            <h3>{{ drink.茶饮名称 }}</h3>
            <span class="drink-type-tag">{{ drink.类型 }}</span>
          </div>
          <div class="drink-body">
            <p v-if="drink.组合成分"><strong>成分：</strong>{{ drink.组合成分 }}</p>
            <p v-if="drink['特点/功效']"><strong>特点：</strong>{{ drink['特点/功效'] }}</p>
            <p v-if="drink.适用场景" class="drink-scene"><strong>场景：</strong>{{ drink.适用场景 }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== DRINK COMPOSITION CHART ====== -->
    <div class="section-full-alt">
      <div class="section-inner">
        <div class="section-header reveal">
          <span class="section-tag">类型分布</span>
          <h2>创新茶饮类型占比</h2>
          <div class="section-divider"></div>
          <p>按大类统计创新茶饮数量分布</p>
        </div>
        <div class="grid-2">
          <div class="chart-dark-card reveal reveal-delay-1">
            <div ref="drinkPieRef" class="chart-box"></div>
          </div>
          <div class="chart-dark-card reveal reveal-delay-2">
            <div ref="macroRef" class="chart-box"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { innovativeDrinksRows, industryMacroRows } from "../data/embedded";

const drinkRows = ref([]);
const macroRows = ref([]);
const curType = ref("全部");

const typeOptions = computed(() => {
  const types = [...new Set(drinkRows.value.map((r) => r.类型).filter(Boolean))];
  return ["全部", ...types];
});

const filtered = computed(() => {
  if (curType.value === "全部") return drinkRows.value;
  return drinkRows.value.filter((r) => r.类型 === curType.value);
});

const drinkPieRef = ref(null);
const macroRef = ref(null);
let charts = {};

const DARK_PALETTE = ["#88a67e", "#c4a265", "#5a7d5b", "#b08968", "#d4c8b8", "#e8dcc8"];

function initChart(key, elRef) { if (!elRef.value) return null; if (charts[key]) charts[key].dispose(); charts[key] = echarts.init(elRef.value); return charts[key]; }
function darkTooltip() { return { backgroundColor: "rgba(26,23,20,0.92)", borderColor: "rgba(196,162,101,0.2)", textStyle: { color: "#e8e0d5", fontSize: 13 } }; }
function darkAxis() { return { axisLine: { lineStyle: { color: "rgba(200,190,175,0.2)" } }, axisTick: { lineStyle: { color: "rgba(200,190,175,0.15)" } }, axisLabel: { color: "rgba(200,190,175,0.7)", fontSize: 12 }, splitLine: { lineStyle: { color: "rgba(200,190,175,0.07)" } }, nameTextStyle: { color: "rgba(200,190,175,0.6)", fontSize: 12 } }; }

function renderDrinkPie() {
  const chart = initChart("drinkPie", drinkPieRef);
  if (!chart || !drinkRows.value.length) return;
  const typeCount = {};
  drinkRows.value.forEach((r) => { if (r.类型) typeCount[r.类型] = (typeCount[r.类型] || 0) + 1; });
  chart.setOption({
    tooltip: { ...darkTooltip(), trigger: "item" },
    legend: { bottom: 8, textStyle: { color: "rgba(200,190,175,0.7)", fontSize: 12 } },
    series: [{
      type: "pie", radius: ["35%", "60%"], center: ["50%", "44%"],
      data: Object.entries(typeCount).map(([name, value]) => ({ name, value })),
      label: { color: "rgba(200,190,175,0.7)", fontSize: 12 },
      itemStyle: { borderColor: "rgba(15,13,10,0.8)", borderWidth: 2, borderRadius: 4 },
      emphasis: { itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.2)" } },
    }],
    color: DARK_PALETTE,
  });
}

function renderMacro() {
  const chart = initChart("macro", macroRef);
  if (!chart || !macroRows.value.length) return;
  const x = macroRows.value.map((r) => r.年份);
  chart.setOption({
    tooltip: { ...darkTooltip(), trigger: "axis" },
    legend: { top: 4, textStyle: { color: "rgba(200,190,175,0.7)", fontSize: 12 } },
    grid: { left: 55, right: 30, top: 48, bottom: 36 },
    xAxis: { type: "category", data: x, ...darkAxis() },
    yAxis: { type: "value", name: "亿元", ...darkAxis() },
    series: [
      {
        name: "现制茶饮规模", type: "line", smooth: true,
        data: macroRows.value.map((r) => Number(r.中国现制茶饮市场规模_亿元 || 0)),
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: "rgba(196,162,101,0.25)" }, { offset: 1, color: "rgba(196,162,101,0)" }]) },
        lineStyle: { width: 2.5 }, symbol: "circle", symbolSize: 6,
      },
      {
        name: "内销额", type: "line", smooth: true,
        data: macroRows.value.map((r) => Number(r.中国茶叶内销额_亿元 || 0)),
        lineStyle: { width: 2.5 }, symbol: "circle", symbolSize: 6,
      },
    ],
    color: DARK_PALETTE,
  });
}

function onResize() { Object.values(charts).forEach((c) => c?.resize()); }
let observer = null;
function setupReveal() {
  observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

onMounted(async () => {
  drinkRows.value = innovativeDrinksRows.filter((r) => r.茶饮名称);
  macroRows.value = industryMacroRows;
  await nextTick();
  renderDrinkPie(); renderMacro();
  window.addEventListener("resize", onResize);
  setupReveal();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onResize);
  observer?.disconnect();
  Object.values(charts).forEach((c) => c?.dispose());
});
</script>


