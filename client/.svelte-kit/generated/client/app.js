export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11')
];

export const server_loads = [2];

export const dictionary = {
		"/": [~3],
		"/admin": [~4,[2]],
		"/admin/parcels": [~5,[2]],
		"/admin/parcels/create": [~6,[2]],
		"/admin/parcels/info/[id]": [~7,[2]],
		"/admin/parcels/[id]": [~8,[2]],
		"/admin/users": [~9,[2]],
		"/admin/users/create": [~10,[2]],
		"/admin/users/[id]": [~11,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';