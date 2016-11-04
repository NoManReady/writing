<template>
  <div class="model-test">
    <div class="form-group" style="color:#333">
      <label v-bind:for="randomId">{{ label }}:</label>
      <input v-bind:id="randomId" v-bind:value="value" v-on:input="onInput">
      <button v-on:input="onInput">trigger</button>
    </div>
  </div>
</template>
<script>
  export default {
      props: ['value', 'label'],
      data() {
          return {
              randomId: 'input-' + Math.random()
          }
      },
      methods: {
          onInput: function(event) {
              this.$emit('input', event.target.value)
          }
      },
  }

</script>
<style>
  /*.model-test{
    width:100px;
    height:100px;
  }*/
</style>
