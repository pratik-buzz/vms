export const controllers: AbortController[] = [];

export function addController(controller: AbortController) {
  controllers.push(controller);
}

export function cancelAllControllers() {
  controllers.forEach(controller => controller.abort());
  controllers.length = 0; // Clear the array
} 