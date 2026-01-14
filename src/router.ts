import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const BASE_TITLE = 'Horse Racing Game';

const routes = [
	{
		path: '/',
		name: 'game',
		component: () => import('@/modules/game/index.vue'),
		meta: { title: 'Horse Racing Game' }
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: '/'
	}
] satisfies RouteRecordRaw[];

const router = createRouter({
	history: createWebHistory(),
	routes
});

router.beforeEach((to) => {
	const metaTitle = typeof to.meta.title === 'string' ? to.meta.title : '';
	document.title = metaTitle ? `${BASE_TITLE} - ${metaTitle}` : BASE_TITLE;
});

export default router;
