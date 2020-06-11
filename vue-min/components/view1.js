const { ref } = Vue;

export default {
  setup() {
    const name = ref("Gregg");
    return { name };
  },
  template: html`<p>View 1</p>`,
};
