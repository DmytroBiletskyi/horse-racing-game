export const isDev = () => {
	try {
		// @ts-expect-error - import.meta is Vite-only
		return Boolean(import.meta?.env?.DEV);
	} catch {
		return false;
	}
};
