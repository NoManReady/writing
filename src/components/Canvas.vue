<template>
  <div class="canvas">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script>
  export default {
    name:'Canvas',
    data(){
      return {}
    },
    watch:{
      val(v){
        console.log(v);
      }
    },
    methods:{
      canvasResize(){
        let boundings=this.$el.getBoundingClientRect();
        let canvas=this.$refs.canvas;
        canvas.style.width=boundings.width+'px';
        canvas.style.height=boundings.height+'px';
      }
    },
    mounted(){
      this.canvasResize();
      window.addEventListener('resize', this.canvasResize,false);
    },
    beforeDestroy(){
      window.removeEventListener('resize', this.canvasResize);
    }
  }
</script>
<style lang="scss">
  .canvas{
    height:100%;
  }
</style>
