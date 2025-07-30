import { toast } from "@zerodevx/svelte-toast";

function pushToast(message: string, success = false) {
  toast.push(message, {
    theme: success
      ? {
          "--toastBackground": "#38a169",
          "--toastBarBackground": "#2f855a",
          "--toastColor": "white",
        }
      : {
          "--toastBackground": "#e53e3e",
          "--toastBarBackground": "#c53030",
          "--toastColor": "white",
        },
  });
}
export { pushToast };
