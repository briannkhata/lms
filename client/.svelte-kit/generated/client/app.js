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
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27'),
	() => import('./nodes/28'),
	() => import('./nodes/29'),
	() => import('./nodes/30'),
	() => import('./nodes/31'),
	() => import('./nodes/32'),
	() => import('./nodes/33'),
	() => import('./nodes/34'),
	() => import('./nodes/35'),
	() => import('./nodes/36'),
	() => import('./nodes/37'),
	() => import('./nodes/38'),
	() => import('./nodes/39'),
	() => import('./nodes/40'),
	() => import('./nodes/41'),
	() => import('./nodes/42'),
	() => import('./nodes/43'),
	() => import('./nodes/44')
];

export const server_loads = [2,3];

export const dictionary = {
		"/": [4],
		"/admin": [~5,[2]],
		"/admin/changepassword": [~6,[2]],
		"/admin/folders": [~7,[2]],
		"/admin/folders/create": [~8,[2]],
		"/admin/folders/[id]": [~9,[2]],
		"/admin/gradelevels": [~10,[2]],
		"/admin/gradelevels/create": [~11,[2]],
		"/admin/gradelevels/[id]": [~12,[2]],
		"/admin/lessons": [~13,[2]],
		"/admin/lessons/create": [~14,[2]],
		"/admin/lessons/info/[id]": [~15,[2]],
		"/admin/lessons/[id]": [~16,[2]],
		"/admin/payments": [~17,[2]],
		"/admin/plans": [~18,[2]],
		"/admin/plans/create": [~19,[2]],
		"/admin/plans/[id]": [~20,[2]],
		"/admin/profile": [~21,[2]],
		"/admin/subjects": [~22,[2]],
		"/admin/subjects/create": [~23,[2]],
		"/admin/subjects/[id]": [~24,[2]],
		"/admin/subscriptions": [~25,[2]],
		"/admin/subscriptions/create": [~26,[2]],
		"/admin/subscriptions/[id]": [~27,[2]],
		"/admin/users": [~28,[2]],
		"/admin/users/create": [~29,[2]],
		"/admin/users/info/[id]": [~30,[2]],
		"/admin/users/[id]": [~31,[2]],
		"/login": [~32],
		"/register": [~33],
		"/student": [~34,[3]],
		"/student/changepassword": [~35,[3]],
		"/student/folders": [~36,[3]],
		"/student/folders/[id]": [~37,[3]],
		"/student/lessons": [~38,[3]],
		"/student/lessons/create": [~39,[3]],
		"/student/lessons/info/[id]": [~40,[3]],
		"/student/lessons/[id]": [~41,[3]],
		"/student/profile": [~42,[3]],
		"/student/subscriptions": [~43,[3]],
		"/student/upgradeplan": [~44,[3]]
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