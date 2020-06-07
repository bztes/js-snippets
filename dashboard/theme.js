const bodyClass = document.body.classList;

// enable animations after start
setTimeout(function(){
  bodyClass.remove("preload");
},500);

// Themes toggle

const themeMap = {
  dark: "light",
  light: "dark",
};

const theme =
  localStorage.getItem("theme") ||
  ((tmp = Object.keys(themeMap)[0]), localStorage.setItem("theme", tmp), tmp);
bodyClass.add(theme);

function toggleTheme() {
  const current = localStorage.getItem("theme");
  const next = themeMap[current];

  bodyClass.replace(current, next);
  localStorage.setItem("theme", next);
}

// Sidebar toggle

const sidebarMap = {
  collapsed: "expanded",
  expanded: "collapsed",
};

var sidebar = Object.keys(sidebarMap)[0];
bodyClass.add(sidebar);

function toggleSidebar() {
  let current = sidebar;
  sidebar = sidebarMap[sidebar];
  bodyClass.replace(current, sidebar);
}
