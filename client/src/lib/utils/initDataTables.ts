export function initializeDataTables(selector = "table") {
  const interval = setInterval(() => {
    if (
      globalThis.$ &&
      globalThis.$(selector).length &&
      globalThis.$.fn.DataTable
    ) {
      globalThis.$(selector).DataTable({
        responsive: true,
        paging: true,
        searching: true,
        info: true,
      });
      clearInterval(interval);
    }
  }, 100);
}
