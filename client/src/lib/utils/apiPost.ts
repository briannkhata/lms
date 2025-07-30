export async function postFormData({
  inputs,
  method,
  url,
  token,
  requiredFields = [],
}: {
  inputs: Record<string, any>;
  method: "POST" | "PUT";
  url: string;
  token: string;
  requiredFields?: string[];
}) {
  const errors: Record<string, string> = {};

  // Basic validation
  for (const field of requiredFields) {
    if (!inputs[field]) {
      errors[field] = `${field.replace(/_/g, " ")} is required.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      status: 400,
      errors,
      values: inputs,
    };
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        success: false,
        status: response.status,
        message: `Server error: ${response.statusText}`,
        raw: text,
      };
    }

    const data = await response.json();
    if (!data.success) {
      return {
        success: false,
        status: 400,
        message: data.msg || "API reported failure.",
      };
    }

    return {
      success: true,
      message: data.msg,
      data,
    };
  } catch (err) {
    return {
      success: false,
      status: 500,
      message: "Could not connect to the API.",
      error: err,
    };
  }
}
