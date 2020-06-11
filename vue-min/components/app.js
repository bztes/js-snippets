const { ref } = Vue;

export default {
  setup() {
    const name = ref("Gregg");
    return { name };
  },
  template: html`
    <ul>
      <li><router-link to="/">View 1</router-link></li>
      <li><router-link to="/view2">View 2</router-link></li>
    </ul>
    <div>
      <h1>Hello {{name}}</h1>
    </div>
    <router-view></router-view>
  `,
};
