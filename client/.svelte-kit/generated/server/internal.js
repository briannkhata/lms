
import root from '../root.js';
import { set_building, set_prerendering } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env, set_safe_public_env } from '../../../node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hash_routing: false,
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"utf-8\" />\r\n    <link rel=\"icon\" href=\"" + assets + "/favicon.png\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n    <title>LMS</title>\r\n    " + head + "\r\n\r\n    <!-- Tailwind CSS -->\r\n    <script src=\"https://cdn.tailwindcss.com\"></script>\r\n\r\n    <!-- Custom Styles -->\r\n    <link rel=\"stylesheet\" href=\"/src/app.css\" />\r\n\r\n    <!-- Google Fonts: Nunito -->\r\n    <link\r\n      href=\"https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap\"\r\n      rel=\"stylesheet\"\r\n    />\r\n\r\n    <!-- Font Awesome Icons -->\r\n    <link\r\n      href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css\"\r\n      rel=\"stylesheet\"\r\n    />\r\n\r\n    <!-- DataTables Styles -->\r\n\r\n    <!-- jQuery & DataTables Scripts -->\r\n    <script defer src=\"https://code.jquery.com/jquery-3.7.0.min.js\"></script>\r\n    <script\r\n      defer\r\n      src=\"https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js\"\r\n    ></script>\r\n    <link\r\n      rel=\"stylesheet\"\r\n      href=\"https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css\"\r\n    />\r\n\r\n    <style>\r\n      html,\r\n      body {\r\n        margin: 0;\r\n        padding: 0;\r\n        height: 100%;\r\n        font-family: \"Nunito\", sans-serif;\r\n      }\r\n\r\n      #app {\r\n        min-height: 100vh;\r\n        display: flex;\r\n        flex-direction: column;\r\n      }\r\n\r\n      main {\r\n        flex: 1 0 auto;\r\n      }\r\n\r\n      footer {\r\n        flex-shrink: 0;\r\n      }\r\n\r\n      /* Video aspect ratio */\r\n      .aspect-w-16 {\r\n        position: relative;\r\n        width: 100%;\r\n        padding-bottom: 56.25%;\r\n      }\r\n\r\n      .aspect-w-16 iframe {\r\n        position: absolute;\r\n        top: 0;\r\n        left: 0;\r\n        width: 100%;\r\n        height: 100%;\r\n      }\r\n\r\n      /* Scroll to Top Button */\r\n      #scrollToTopBtn {\r\n        position: fixed;\r\n        bottom: 30px;\r\n        right: 30px;\r\n        display: none;\r\n        background-color: #2563eb;\r\n        color: white;\r\n        padding: 12px 16px;\r\n        border-radius: 9999px;\r\n        font-size: 16px;\r\n        cursor: pointer;\r\n        z-index: 100;\r\n        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\r\n        transition: background-color 0.3s ease;\r\n      }\r\n\r\n      #scrollToTopBtn:hover {\r\n        background-color: #1e40af;\r\n      }\r\n\r\n      /* Hover underline effect */\r\n      .hover-effect {\r\n        position: relative;\r\n        display: inline-block;\r\n        color: #2563eb;\r\n        transition: color 0.3s ease;\r\n      }\r\n\r\n      .hover-effect::after {\r\n        content: \"\";\r\n        position: absolute;\r\n        left: 0;\r\n        bottom: -2px;\r\n        width: 100%;\r\n        height: 2px;\r\n        background-color: #1e40af;\r\n        transform: scaleX(0);\r\n        transform-origin: right;\r\n        transition: transform 0.3s ease;\r\n      }\r\n\r\n      .hover-effect:hover {\r\n        color: #1e40af;\r\n      }\r\n\r\n      .hover-effect:hover::after {\r\n        transform: scaleX(1);\r\n        transform-origin: left;\r\n      }\r\n\r\n      /* Dropdown menu (desktop) */\r\n      nav ul li {\r\n        position: relative;\r\n      }\r\n\r\n      nav ul li ul {\r\n        position: absolute;\r\n        left: 0;\r\n        top: 100%;\r\n        background-color: #dbeafe;\r\n        min-width: 12rem;\r\n        padding: 0.5rem 0;\r\n        border-radius: 0.375rem;\r\n        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\r\n        opacity: 0;\r\n        visibility: hidden;\r\n        transform: translateY(10px);\r\n        transition:\r\n          opacity 0.3s ease,\r\n          transform 0.3s ease;\r\n        z-index: 1000;\r\n      }\r\n\r\n      nav ul li:hover > ul,\r\n      nav ul li:focus-within > ul {\r\n        opacity: 1;\r\n        visibility: visible;\r\n        transform: translateY(0);\r\n      }\r\n\r\n      nav ul li ul li a {\r\n        display: block;\r\n        padding: 0.5rem 1rem;\r\n        color: #1e40af;\r\n        font-weight: 600;\r\n        white-space: nowrap;\r\n      }\r\n\r\n      nav ul li ul li a:hover {\r\n        background-color: #bfdbfe;\r\n      }\r\n\r\n      /* Mobile dropdown */\r\n      #mobile-menu nav ul li ul {\r\n        position: static;\r\n        opacity: 1 !important;\r\n        visibility: visible !important;\r\n        transform: none !important;\r\n        box-shadow: none !important;\r\n        background-color: transparent !important;\r\n        padding-left: 1rem;\r\n      }\r\n    </style>\r\n  </head>\r\n\r\n  <body class=\"flex flex-col min-h-screen bg-gray-50 text-gray-800\">\r\n    <div>\r\n      <main class=\"flex-grow\">\r\n        <div>" + body + "</div>\r\n      </main>\r\n    </div>\r\n\r\n    <!-- Scroll to Top Button -->\r\n    <button\r\n      id=\"scrollToTopBtn\"\r\n      aria-label=\"Scroll to top\"\r\n      onclick=\"window.scrollTo({ top: 0, behavior: 'smooth' });\"\r\n    >\r\n      ⬆ Top\r\n    </button>\r\n  </body>\r\n</html>\r\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "gn8yhg"
};

export async function get_hooks() {
	let handle;
	let handleFetch;
	let handleError;
	let init;
	

	let reroute;
	let transport;
	

	return {
		handle,
		handleFetch,
		handleError,
		init,
		reroute,
		transport
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation, set_safe_public_env };
