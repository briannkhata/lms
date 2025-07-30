export function validateSubjectForm(formData: FormData): {
  errors: Record<string, string>;
  payload: { code: string; name: string };
} {
  const code = formData.get("code")?.toString() || "";
  const name = formData.get("name")?.toString() || "";

  const errors: Record<string, string> = {};
  if (!code) errors.code = "Code is required.";
  if (!name) errors.name = "Name is required.";

  return {
    errors,
    payload: { code, name },
  };
}
