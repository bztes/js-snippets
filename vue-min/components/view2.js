const { ref } = Vue;

export default {
  setup() {
    const name = ref("Gregg");
    return { name };
  },
  template: html`<p>View 2</p>`,
};
