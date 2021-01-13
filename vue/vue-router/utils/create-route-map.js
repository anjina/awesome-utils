export function createRouteMap(routes) {
  let map = {};
  for(let i = 0; i < routes.length; i++) {
    const item = routes[i];
    map[item.path] = item.component;
  }
  return map;
}