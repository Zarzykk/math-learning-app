<template>
  <div>
    <canvas
      ref="drawingCanvas"
      :width="canvasWidth"
      :height="canvasHeight"
      style="border: 1px solid #ccc; cursor: crosshair;"
    ></canvas>
  </div>
</template>

<script>
export default {
  props: {
    canvasWidth: {
      type: Number,
      default: 800,
    },
    canvasHeight: {
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
      isDrawing: false,
      ctx: null,
    };
  },
  mounted() {
    const canvas = this.$refs.drawingCanvas;
    this.ctx = canvas.getContext("2d");

    // Obsługa rysowania
    canvas.addEventListener("mousedown", this.startDrawing);
    canvas.addEventListener("mousemove", this.draw);
    canvas.addEventListener("mouseup", this.stopDrawing);
    canvas.addEventListener("mouseout", this.stopDrawing);
  },
  methods: {
    startDrawing(event) {
      const rect = this.$refs.drawingCanvas.getBoundingClientRect();
      this.isDrawing = true;
      this.ctx.beginPath();
      this.ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    },
    draw(event) {
      if (!this.isDrawing) return;
      const rect = this.$refs.drawingCanvas.getBoundingClientRect();
      this.ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    },
    stopDrawing() {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.ctx.closePath();
      }
    },
    getCanvasData() {
      const canvas = this.$refs.drawingCanvas;
      return canvas.toDataURL("image/png");
    },
    loadCanvasData(data) {
      const canvas = this.$refs.drawingCanvas;
      const ctx = canvas.getContext("2d");
      const image = new Image();
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Czyszczenie
        ctx.drawImage(image, 0, 0); // Wczytanie obrazu
      };
      image.src = data;
    },
  },
};
//TODO rozwinac ten komponent, tak zeby pobierać dane o tresci zadania, na poczatku mock zeby mozna było pisać, ale żeby można było także rysować, pisanie cały czas, rysowanie moze byc aktywna jedna instancja 

</script>

<style scoped>
canvas {
  background-color: #fff;
}
</style>
